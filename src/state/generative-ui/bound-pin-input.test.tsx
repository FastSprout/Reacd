import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundPinInput } from './bound-pin-input.js';

const reference = { state: 'code', mode: 'readWrite' } as const;
const node = { type: 'PinInput', label: 'Code', value: reference } as const;
describe('bound PinInput', () => {
  it('does not complete when another constraint rejects a paste', async () => {
    const user = userEvent.setup();
    const registry = success(
      createStateRegistry([
        { key: 'code', kind: 'text', access: 'readWrite', initial: '' },
      ]),
    );
    const complete = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundPinInput
          node={{ ...node, completeAction: 'verify' }}
          registry={registry}
          actions={{ verify: complete }}
        />
        <BoundPinInput
          node={{
            ...node,
            label: 'Limited reader',
            length: 4,
            value: { ...reference, mode: 'read' },
          }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('textbox', { name: 'Code' }));
    await user.paste('123456');
    expect(success(registry.read('code')).value).toBe('');
    expect(complete).not.toHaveBeenCalled();
  });
  it('updates state before dispatching registered completion', async () => {
    const user = userEvent.setup();
    const registry = success(
      createStateRegistry([
        { key: 'code', kind: 'text', access: 'readWrite', initial: '' },
      ]),
    );
    const complete = vi.fn(() => {
      expect(success(registry.read('code')).value).toBe('123456');
    });
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundPinInput
          node={{ ...node, completeAction: 'complete' }}
          registry={registry}
          actions={{ complete }}
        />
        <BoundPinInput
          node={{
            ...node,
            label: 'Reader',
            value: {
              ...reference,
              mode: 'read',
            },
          }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Code' }), '123456');
    expect(complete).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveValue('123456');
    expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveAttribute('readonly');
    act(() => {
      expect(registry.update('code', 'invalid').success).toBe(false);
    });
    expect(success(registry.read('code')).value).toBe('123456');
  });
  it.each([undefined, 'missing', 'toString'])(
    'does not call absent or inherited completion handlers: %s',
    async (action) => {
      const user = userEvent.setup();
      const registry = success(
        createStateRegistry([
          { key: 'code', kind: 'text', access: 'readWrite', initial: '' },
        ]),
      );
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <BoundPinInput
            node={{ ...node, length: 1, completeAction: action }}
            registry={registry}
            actions={{}}
          />
        </ReacdProvider>,
      );
      await user.type(screen.getByRole('textbox', { name: 'Code' }), '0');
      expect(success(registry.read('code')).value).toBe('0');
    },
  );
  it.each(
    [
      [],
      [{ key: 'code', kind: 'number', access: 'readWrite', initial: 1 }],
      [{ key: 'code', kind: 'text', access: 'readWrite', initial: 'x' }],
      [{ key: 'code', kind: 'text', access: 'read', initial: '' }],
    ].map((definitions) => ({ definitions })),
  )('reports invalid or unavailable state', ({ definitions }) => {
    const registry = success(createStateRegistry(definitions));
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundPinInput node={node} registry={registry} actions={{}} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
