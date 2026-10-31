import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundToast } from './bound-toast.js';
import { ReacdProvider } from '../../index.js';
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'notice', kind: 'boolean', access: 'readWrite', initial: true }],
  root: {
    type: 'Toast',
    title: 'Generative notice',
    duration: 'persistent',
    open: { state: 'notice', mode: 'readWrite' },
    action: { label: 'Resolve notification', action: 'resolve' },
  },
});
describe('generative toast', () => {
  it('runs registered actions and writes controlled boolean opening', async () => {
    const registry = createDocumentState(declaration);
    const resolve = vi.fn();
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{ resolve }}
      />,
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Resolve notification' }),
    );
    expect(resolve).toHaveBeenCalledOnce();
    expect(resolve).toHaveBeenCalledWith({ state: registry });
    expect(registry.read('notice')).toMatchObject({ data: { value: false } });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('keeps the toast visible after rejected state writes and recovers', async () => {
    const registry = createDocumentState(declaration);
    const lease = registry.constrain(['notice'], (read) => {
      const snapshot = read('notice');
      if (!snapshot.success) return snapshot;
      return snapshot.data.value
        ? { success: true, data: undefined }
        : { success: false, issues: [{ path: '$', message: 'Dismissal is blocked.' }] };
    });
    if (!lease.success) throw new Error('Invalid constraint fixture.');
    const withoutAction = {
      ...declaration,
      root: {
        type: 'Toast',
        title: 'Held notice',
        duration: 'persistent',
        open: { state: 'notice', mode: 'readWrite' },
      },
    };
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={withoutAction}
        registry={registry}
      />,
    );
    await screen.findByRole('dialog', { name: 'Held notice' });
    fireEvent.keyDown(window, { key: 'F6' });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(
      screen.getByText(/Dismissal is blocked/, { selector: 'li' }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('dialog', { name: 'Held notice' })).toBeVisible();
    act(lease.data);
    fireEvent.keyDown(window, { key: 'F6' });
    const toast = screen.getByRole('dialog', { name: 'Held notice' });
    toast.focus();
    fireEvent.keyDown(toast, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('rechecks callable registered actions', async () => {
    const inherited = vi.fn();
    const actions: Record<string, () => void> = { resolve: vi.fn() };
    const registry = createDocumentState(declaration);
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={actions}
      />,
    );
    const action = await screen.findByRole('button', { name: 'Resolve notification' });
    Object.setPrototypeOf(actions, { resolve: inherited });
    delete actions['resolve'];
    fireEvent.click(action);
    expect(inherited).not.toHaveBeenCalled();
    expect(registry.read('notice')).toMatchObject({ data: { value: true } });
    Object.defineProperty(actions, 'resolve', { value: 'invalid', configurable: true });
    fireEvent.click(action);
    expect(registry.read('notice')).toMatchObject({ data: { value: true } });
  });
  it('rejects invalid bindings and unresolved actions before activation', () => {
    expect(validateGenerativeDocument({ ...declaration, state: [] }).success).toBe(
      false,
    );
    render(<GenerativeUI adapter={shadcnAdapter} document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
  });
  it('reports invalid bindings and renders SSR safely', () => {
    const registry = createDocumentState(declaration);
    const node = declaration.root;
    if (node.type !== 'Toast') throw new Error('Invalid fixture.');
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundToast
          node={{ ...node, open: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      renderToString(
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          actions={{ resolve: vi.fn() }}
        />,
      ),
    ).not.toContain('role="dialog"');
  });
});
