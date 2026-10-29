import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  GenerativeUI,
  createDocumentState,
  validateGenerativeDocument,
} from '../../generative.js';
import { success } from '../../../test-support/data-table.js';
import { dashboardDocument } from '../../../test-support/dashboard-document.js';
import {
  installLayout,
  resizeContainers,
} from '../../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it('composes dashboard nodes with live constraints and atomic selection', async () => {
  const user = userEvent.setup();
  const document = success(validateGenerativeDocument(dashboardDocument()));
  const registry = createDocumentState(document);
  const inspect = vi.fn();
  render(
    <GenerativeUI
      document={document}
      registry={registry}
      actions={{
        inspect,
        openSearch: ({ state }) => {
          state.update('searchOpen', true);
        },
      }}
    />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('complementary')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  expect(success(registry.read('desktop')).value).toBe(false);
  expect(success(registry.read('layout')).value).toEqual([
    { id: 'navigation', share: 25 },
    { id: 'inbox', share: 75 },
  ]);
  await user.click(screen.getByRole('button', { name: 'Expand navigation' }));
  const handle = screen.getByRole('separator');
  fireEvent.keyDown(handle, { key: 'ArrowRight' });
  expect(handle).toHaveAttribute('aria-valuenow', '26');
  expect(
    registry.update('layout', [
      { id: 'navigation', share: 5 },
      { id: 'inbox', share: 95 },
    ]).success,
  ).toBe(false);
  await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
  await user.type(screen.getByRole('combobox'), 'review');
  await user.keyboard('{Enter}');
  expect(inspect).toHaveBeenCalledOnce();
  expect(success(registry.read('selected')).value).toBe('inspect-inbox');
  expect(success(registry.read('query')).value).toBe('review');
  expect(success(registry.read('searchOpen')).value).toBe(false);
  resizeContainers(320);
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(success(registry.read('mobile')).value).toBe(true);
  expect(screen.getByRole('textbox', { name: 'Navigation draft' })).toHaveValue(
    'Retained draft',
  );
  await user.keyboard('{Escape}');
  await waitFor(() => expect(success(registry.read('mobile')).value).toBe(false));
});

it('vetoes targets after rejected selection writes and recovers', async () => {
  const user = userEvent.setup();
  const document = success(validateGenerativeDocument(dashboardDocument()));
  const registry = createDocumentState(document);
  const inspect = vi.fn();
  render(
    <GenerativeUI
      document={document}
      registry={registry}
      actions={{
        inspect,
        openSearch: ({ state }) => {
          state.update('searchOpen', true);
        },
      }}
    />,
  );
  const release = success(
    registry.constrain(['selected'], (read) => {
      const value = read('selected');
      if (!value.success) return value;
      return value.data.value === ''
        ? { success: true, data: undefined }
        : {
            success: false,
            issues: [{ path: 'selected', message: 'Selection denied.' }],
          };
    }),
  );
  await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
  await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
  expect(inspect).not.toHaveBeenCalled();
  expect(success(registry.read('searchOpen')).value).toBe(true);
  expect(success(registry.read('selected')).value).toBe('');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Search state update was rejected',
  );
  release();
  await user.type(screen.getByRole('combobox'), 'review');
  expect(screen.queryByRole('alert')).toBeNull();
  await user.keyboard('{Enter}');
  expect(inspect).toHaveBeenCalledOnce();
  expect(success(registry.read('searchOpen')).value).toBe(false);
});

it('supports optional selection and blocks action registry mutation', async () => {
  const user = userEvent.setup();
  const document = success(validateGenerativeDocument(dashboardDocument(false)));
  const registry = createDocumentState(document);
  const inspect = vi.fn();
  const actions = { inspect, openSearch: () => undefined };
  render(<GenerativeUI document={document} registry={registry} actions={actions} />);
  Reflect.deleteProperty(actions, 'openSearch');
  Object.setPrototypeOf(actions, { openSearch: inspect });
  await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
  expect(inspect).not.toHaveBeenCalled();
  act(() => {
    registry.update('searchOpen', true);
  });
  Reflect.set(actions, 'inspect', undefined);
  await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
  expect(inspect).not.toHaveBeenCalled();
  expect(success(registry.read('selected')).value).toBe('');
  expect(success(registry.read('query')).value).toBe('');
  expect(success(registry.read('searchOpen')).value).toBe(false);
  act(() => {
    registry.update('searchOpen', true);
  });
  Reflect.deleteProperty(actions, 'inspect');
  await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
  expect(inspect).not.toHaveBeenCalled();
});

it('supports safe link-only search results', async () => {
  const user = userEvent.setup();
  const original = success(validateGenerativeDocument(dashboardDocument()));
  if (original.root.type !== 'DashboardGroup') throw new Error('Missing group.');
  const document = {
    ...original,
    root: {
      ...original.root,
      children: original.root.children.map((node) =>
        node.type === 'DashboardSearch'
          ? {
              ...node,
              groups: [
                {
                  key: 'links',
                  label: 'Documentation',
                  items: [
                    {
                      key: 'guide',
                      label: 'Read guide',
                      href: '/guide',
                    },
                  ],
                },
              ],
            }
          : node,
      ),
    },
  };
  const registry = createDocumentState(success(validateGenerativeDocument(document)));
  render(
    <GenerativeUI
      document={document}
      registry={registry}
      actions={{
        inspect: () => undefined,
        openSearch: ({ state }) => {
          state.update('searchOpen', true);
        },
      }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
  expect(screen.getByRole('option', { name: 'Read guide' })).toBeVisible();
  await user.keyboard('{Escape}');
  expect(success(registry.read('searchOpen')).value).toBe(false);
});

it('surfaces declined query and dismissal writes', async () => {
  const user = userEvent.setup();
  const document = success(validateGenerativeDocument(dashboardDocument()));
  const registry = createDocumentState(document);
  render(
    <GenerativeUI
      document={document}
      registry={registry}
      actions={{
        inspect: () => undefined,
        openSearch: ({ state }) => {
          state.update('searchOpen', true);
        },
      }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
  const queryLease = success(
    registry.constrain(['query'], (read) => {
      const value = read('query');
      if (!value.success) return value;
      return value.data.value === ''
        ? { success: true, data: undefined }
        : {
            success: false,
            issues: [{ path: 'query', message: 'Editing denied.' }],
          };
    }),
  );
  await user.type(screen.getByRole('combobox'), 'x');
  expect(success(registry.read('query')).value).toBe('');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Search state update was rejected',
  );
  queryLease();
  await user.type(screen.getByRole('combobox'), 'review');
  expect(screen.queryByRole('alert')).toBeNull();
  const closeLease = success(
    registry.constrain(['searchOpen'], (read) => {
      const value = read('searchOpen');
      if (!value.success) return value;
      return value.data.value === true
        ? { success: true, data: undefined }
        : {
            success: false,
            issues: [{ path: 'searchOpen', message: 'Closing denied.' }],
          };
    }),
  );
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(success(registry.read('searchOpen')).value).toBe(true);
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Search state update was rejected',
  );
  closeLease();
  await user.keyboard('{Escape}');
  expect(success(registry.read('searchOpen')).value).toBe(false);
});
