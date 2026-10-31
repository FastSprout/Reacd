import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundPagination } from './bound-pagination.js';
import { GenerativeBreadcrumb } from './generative-breadcrumb.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    {
      key: 'page',
      kind: 'pagination',
      initial: { pageIndex: 0, pageSize: 10 },
      access: 'readWrite',
    },
  ],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Pagination',
        label: 'Editable pages',
        totalItems: 23,
        value: { state: 'page', mode: 'readWrite' },
      },
      {
        type: 'Pagination',
        label: 'Page display',
        totalItems: 23,
        value: { state: 'page', mode: 'read' },
        navigation: { href: '/orders' },
      },
      {
        type: 'Breadcrumb',
        label: 'Generated path',
        items: [
          { key: 'home', label: 'Home', href: '/' },
          { key: 'jump', label: 'Jump to last page', action: 'jump' },
          {
            key: 'disabled',
            label: 'Disabled path action',
            action: 'disabled',
            disabled: true,
          },
          { key: 'current', label: 'Current view' },
        ],
      },
    ],
  },
});
describe('generative paging and paths', () => {
  it('shares pages across readers, writers and actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const disabled = vi.fn();
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{
          jump: ({ state }) => {
            state.update('page', { pageIndex: 2, pageSize: 10 });
          },
          disabled,
        }}
      />,
    );
    const editable = within(screen.getByRole('navigation', { name: 'Editable pages' }));
    const display = within(screen.getByRole('navigation', { name: 'Page display' }));
    await user.click(editable.getByRole('button', { name: 'Next page' }));
    expect(display.getByRole('status')).toHaveTextContent('Page 2 of 3');
    for (const link of display.getAllByRole('link')) {
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('href');
    }
    await user.click(screen.getByRole('button', { name: 'Jump to last page' }));
    await user.click(screen.getByRole('button', { name: 'Disabled path action' }));
    expect(disabled).not.toHaveBeenCalled();
    expect(editable.getByRole('status')).toHaveTextContent('Page 3 of 3');
    act(() => {
      expect(registry.update('page', { pageIndex: 3, pageSize: 10 }).success).toBe(
        false,
      );
    });
    expect(display.getByRole('status')).toHaveTextContent('Page 3 of 3');
  });
  it('reports shared-constraint failures without changing the page', async () => {
    const user = userEvent.setup();
    const document = defineGenerativeDeclaration({
      ...declaration,
      root: {
        type: 'Pagination',
        label: 'Constrained pages',
        totalItems: 23,
        value: { state: 'page', mode: 'readWrite' },
      },
    });
    const registry = createDocumentState(document);
    const lease = registry.constrain(['page'], (read) => {
      const snapshot = read('page');
      if (!snapshot.success) return snapshot;
      return snapshot.data.kind === 'pagination' && snapshot.data.value.pageIndex <= 1
        ? { success: true, data: undefined }
        : { success: false, issues: [{ path: 'page', message: 'At most page 2.' }] };
    });
    if (!lease.success) throw new Error('Constraint registration failed.');
    render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
    );
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(screen.getByRole('alert')).toHaveTextContent('At most page 2.');
    expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
    lease.data();
  });
  it('rejects missing actions and incompatible paging definitions', () => {
    const view = render(
      <GenerativeUI adapter={shadcnAdapter} document={declaration} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('jump');
    expect(screen.getByRole('alert')).toHaveTextContent('disabled');
    view.unmount();
    for (const change of [
      { state: [] },
      { state: [{ key: 'page', kind: 'text', initial: '', access: 'readWrite' }] },
      {
        state: [
          {
            key: 'page',
            kind: 'pagination',
            initial: { pageIndex: 4, pageSize: 10 },
            access: 'readWrite',
          },
        ],
      },
      {
        state: [
          {
            key: 'page',
            kind: 'pagination',
            initial: { pageIndex: 0, pageSize: 10 },
            access: 'read',
          },
        ],
      },
    ])
      expect(validateGenerativeDocument({ ...declaration, ...change }).success).toBe(
        false,
      );
  });
  it('fails closed when live state or action maps become unavailable', async () => {
    const user = userEvent.setup();
    const empty = createDocumentState(
      defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'Empty' },
      }),
    );
    const view = render(
      <BoundPagination
        registry={empty}
        node={{
          type: 'Pagination',
          label: 'Missing',
          totalItems: 10,
          value: { state: 'missing', mode: 'read' },
        }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    const node = {
      type: 'Breadcrumb',
      label: 'Unavailable action',
      items: [{ key: 'missing', label: 'Unavailable', action: 'missing' }],
    } as const;
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <GenerativeBreadcrumb node={node} registry={empty} actions={{}} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <GenerativeBreadcrumb
          node={node}
          registry={empty}
          actions={Object.defineProperty({}, 'missing', { value: 'not callable' })}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
