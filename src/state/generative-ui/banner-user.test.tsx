import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { BoundBanner } from './bound-banner.js';
import { GenerativeUser } from './generative-user.js';
import { createDocumentState } from './create-document-state.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';

function state() {
  return createDocumentState(
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [{ key: 'visible', kind: 'boolean', access: 'readWrite', initial: true }],
      root: { type: 'Text', content: 'State fixture' },
    }),
  );
}
describe('Banner and User host bindings', () => {
  it('writes controlled banner visibility and isolates independent hosts', async () => {
    const user = userEvent.setup();
    const first = state();
    const second = state();
    render(
      <ReacdProvider>
        <BoundBanner
          properties={{ title: 'First', dismissible: true }}
          reference={{ state: 'visible', mode: 'readWrite' }}
          registry={first}
        />
        <BoundBanner
          properties={{ title: 'Second', dismissible: true }}
          reference={{ state: 'visible', mode: 'readWrite' }}
          registry={second}
        />
      </ReacdProvider>,
    );
    const [close] = screen.getAllByRole('button', { name: 'Dismiss banner' });
    if (close === undefined) throw new Error('Missing dismissal control.');
    await user.click(close);
    expect(screen.queryByRole('status', { name: 'First' })).toBeNull();
    expect(screen.getByRole('status', { name: 'Second' })).toBeInTheDocument();
    act(() => {
      first.update('visible', true);
    });
    expect(screen.getByRole('status', { name: 'First' })).toBeInTheDocument();
  });
  it('reports invalid bindings before rendering banner content', () => {
    render(
      <ReacdProvider>
        <BoundBanner
          properties={{ title: 'Missing' }}
          reference={{ state: 'unknown', mode: 'readWrite' }}
          registry={state()}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('unknown');
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('resolves own actions and preserves plain identities', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const registry = state();
    const view = render(
      <ReacdProvider>
        <GenerativeUser
          node={{ type: 'User', name: 'Ada' }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    view.rerender(
      <ReacdProvider>
        <GenerativeUser
          node={{ type: 'User', name: 'Ada', action: 'open' }}
          registry={registry}
          actions={{ open: handler }}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Ada' }));
    expect(handler).toHaveBeenCalledWith({ state: registry });
    const inherited = {};
    Object.setPrototypeOf(inherited, { open: handler });
    view.rerender(
      <ReacdProvider>
        <GenerativeUser
          node={{ type: 'User', name: 'Ada', action: 'open' }}
          registry={registry}
          actions={inherited}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Ada' }));
    expect(handler).toHaveBeenCalledOnce();
  });
});
