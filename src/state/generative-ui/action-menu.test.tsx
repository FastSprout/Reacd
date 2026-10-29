import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundActionMenu } from './bound-action-menu.js';
import { ReacdProvider } from '../../index.js';
const open = { state: 'open', mode: 'readWrite' as const };
const checked = { state: 'pin', mode: 'readWrite' as const };
const value = { state: 'mode', mode: 'readWrite' as const };
const items = [
  { type: 'checkbox' as const, key: 'pin', label: 'Pin', checked },
  {
    type: 'radio' as const,
    key: 'mode',
    label: 'Mode',
    value,
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ],
  },
  {
    type: 'submenu' as const,
    key: 'more',
    label: 'More',
    items: [
      { type: 'action' as const, key: 'run', label: 'Run', action: 'run' },
      { type: 'label' as const, key: 'label', label: 'Nested label' },
    ],
  },
];
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'open', kind: 'boolean', access: 'readWrite', initial: false },
    { key: 'pin', kind: 'boolean', access: 'readWrite', initial: false },
    { key: 'mode', kind: 'text', access: 'readWrite', initial: 'one' },
  ],
  root: { type: 'DropdownMenu', label: 'Actions', open, items },
});

describe('generative action menus', () => {
  it('binds choices and invokes registered actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const run = vi.fn();
    render(
      <GenerativeUI document={declaration} registry={registry} actions={{ run }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Pin' }));
    expect(registry.read('pin')).toMatchObject({ data: { value: true } });
    await user.click(screen.getByRole('menuitemradio', { name: 'Two' }));
    expect(registry.read('mode')).toMatchObject({ data: { value: 'two' } });
    expect(registry.update('mode', 'absent').success).toBe(false);
    await user.click(screen.getByRole('menuitem', { name: 'More' }));
    const action = await screen.findByRole('menuitem', { name: 'Run' });
    await waitFor(() => expect(action).not.toHaveStyle({ pointerEvents: 'none' }));
    fireEvent.click(action);
    expect(run).toHaveBeenCalledOnce();
    expect(registry.read('open')).toMatchObject({ data: { value: false } });
  });
  it('supports readonly choices and context child traversal', async () => {
    const user = userEvent.setup();
    const context = defineGenerativeDeclaration({
      ...declaration,
      root: {
        type: 'ContextMenu',
        label: 'Context',
        open,
        items: [
          {
            ...items[0],
            type: 'checkbox',
            key: 'pin',
            label: 'Pin',
            checked: { state: 'pin', mode: 'read' },
          },
        ],
        children: [{ type: 'Text', content: 'Context record' }],
      },
    });
    render(<GenerativeUI document={context} />);
    fireEvent.contextMenu(screen.getByRole('group', { name: 'Context' }));
    const pin = await screen.findByRole('menuitemcheckbox', { name: 'Pin' });
    expect(pin).toHaveAttribute('aria-disabled', 'true');
    await user.click(pin);
    expect(pin).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('Context record')).toBeInTheDocument();
  });
  it('rejects registry writes and recovers', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const lease = registry.constrain(['pin'], (read) => {
      const pin = read('pin');
      if (!pin.success) return pin;
      return pin.data.value
        ? {
            success: false,
            issues: [{ path: '$', message: 'Pinning is currently blocked.' }],
          }
        : { success: true, data: undefined };
    });
    if (!lease.success) throw new Error('Constraint registration failed.');
    render(
      <GenerativeUI
        document={declaration}
        registry={registry}
        actions={{ run: vi.fn() }}
      />,
    );
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('menuitemcheckbox'));
    expect(
      screen.getByText(/Pinning is currently blocked/, { selector: 'li' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByText('The menu change was rejected.')).toBeVisible();
    act(lease.data);
    await user.click(screen.getByRole('menuitemcheckbox'));
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(
      screen.queryByText(/Pinning is currently blocked/, { selector: 'li' }),
    ).toBeNull();
  });
  it('rejects invalid actions and initial state', () => {
    render(<GenerativeUI document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action');
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: declaration.state.map((entry) =>
          entry.key === 'mode' ? { ...entry, initial: 'absent' } : entry,
        ),
      }).success,
    ).toBe(false);
    const wrong = {
      ...declaration,
      root: {
        ...declaration.root,
        items: [{ type: 'checkbox', key: 'wrong', label: 'Wrong', checked: value }],
      },
    };
    expect(validateGenerativeDocument(wrong).success).toBe(false);
  });
  it('renders deterministic server triggers without opening portals', () => {
    const markup = renderToString(
      <GenerativeUI document={declaration} actions={{ run: vi.fn() }} />,
    );
    expect(markup).toContain('Actions');
    expect(markup).not.toContain('menuitemcheckbox');
  });
  it('reports direct invalid binding failures', () => {
    const registry = createDocumentState(declaration);
    const root = declaration.root;
    if (root.type !== 'DropdownMenu') throw new Error('Unexpected fixture.');
    const { rerender } = render(
      <ReacdProvider>
        <BoundActionMenu
          node={{ ...root, open: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(
      <ReacdProvider>
        <BoundActionMenu
          node={{
            ...root,
            items: [
              {
                type: 'checkbox',
                key: 'missing',
                label: 'Missing',
                checked: {
                  state: 'missing',
                  mode: 'readWrite',
                },
              },
            ],
          }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
it('retains closed state and shows rejected opening writes', async () => {
  const user = userEvent.setup();
  const registry = createDocumentState(declaration);
  registry.constrain(['open'], (read) => {
    const snapshot = read('open');
    if (!snapshot.success) return snapshot;
    return snapshot.data.value
      ? { success: false, issues: [{ path: '$', message: 'Opening is blocked.' }] }
      : { success: true, data: undefined };
  });
  render(
    <GenerativeUI
      document={declaration}
      registry={registry}
      actions={{ run: vi.fn() }}
    />,
  );
  await user.click(screen.getByRole('button'));
  fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowDown' });
  expect(screen.getByRole('alert')).toHaveTextContent('Opening is blocked.');
  expect(screen.queryByRole('menu')).toBeNull();
});
