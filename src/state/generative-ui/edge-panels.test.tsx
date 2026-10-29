import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundEdgePanel } from './bound-edge-panel.js';

function declaration(type: 'Drawer' | 'Slideover') {
  return defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [{ key: 'open', kind: 'boolean', initial: false, access: 'readWrite' }],
    root: {
      type,
      title: `${type} transport`,
      description: 'Controlled panel state.',
      triggerLabel: `Open ${type} transport`,
      open: { state: 'open', mode: 'readWrite' },
      children: [{ type: 'Text', content: 'Transport body' }],
      footer: [{ type: 'Button', label: 'Transport footer', action: 'run' }],
    },
  });
}

describe.each(['Drawer', 'Slideover'] as const)('generative %s', (type) => {
  it('uses writable boolean state and validates footer actions', async () => {
    const user = userEvent.setup();
    const doc = declaration(type);
    const action = vi.fn();
    const registry = createDocumentState(doc);
    const view = render(
      <GenerativeUI document={doc} registry={registry} actions={{ run: action }} />,
    );
    await user.click(screen.getByRole('button', { name: `Open ${type} transport` }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Transport body');
    await user.click(screen.getByRole('button', { name: 'Transport footer' }));
    expect(action).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    view.rerender(<GenerativeUI document={doc} registry={registry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
  });

  it('reports rejected opening and closing without losing state', async () => {
    const user = userEvent.setup();
    const doc = declaration(type);
    const registry = createDocumentState(doc);
    const lease = registry.constrain(['open'], (read) => {
      const value = read('open');
      if (!value.success) return value;
      return value.data.value === true
        ? {
            success: false,
            issues: [{ path: '$.open', message: 'Opening is blocked.' }],
          }
        : { success: true, data: undefined };
    });
    if (!lease.success) throw new Error('Constraint registration failed.');
    render(
      <GenerativeUI document={doc} registry={registry} actions={{ run: vi.fn() }} />,
    );
    await user.click(screen.getByRole('button', { name: `Open ${type} transport` }));
    expect(screen.getByRole('alert')).toHaveTextContent('Opening is blocked.');
    act(() => lease.data());
    await user.click(screen.getByRole('button', { name: `Open ${type} transport` }));
    const closeLease = registry.constrain(['open'], (read) => {
      const value = read('open');
      if (!value.success) return value;
      return value.data.value === false
        ? {
            success: false,
            issues: [{ path: '$.open', message: 'Closing is blocked.' }],
          }
        : { success: true, data: undefined };
    });
    if (!closeLease.success) throw new Error('Closing constraint registration failed.');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Closing is blocked.');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => closeLease.data());
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('fails safely for missing live state and supports omitted footer slots', () => {
    const doc = declaration(type);
    if (doc.root.type !== type) throw new Error('Unexpected transport root.');
    render(
      <ReacdProvider>
        <BoundEdgePanel
          node={{ ...doc.root, open: { state: 'missing', mode: 'readWrite' } }}
          registry={createDocumentState(doc)}
          footer={undefined}
        >
          {undefined}
        </BoundEdgePanel>
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });

  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates %s without leaking open state between requests',
    async (templateId) => {
      const user = userEvent.setup();
      const doc = declaration(type);
      const content = (
        <GenerativeUI
          document={doc}
          templateId={templateId}
          actions={{ run: vi.fn() }}
        />
      );
      const container = document.createElement('div');
      container.innerHTML = renderToString(content);
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(content, {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      await user.click(screen.getByRole('button', { name: `Open ${type} transport` }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(renderToString(content)).not.toContain('role="dialog"');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
