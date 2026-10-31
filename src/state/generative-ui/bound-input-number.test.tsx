import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInputNumber } from './bound-input-number.js';

const reference = { state: 'quantity', mode: 'readWrite' } as const;
const node = {
  type: 'InputNumber',
  label: 'Quantity',
  value: reference,
  min: 0,
  max: 10,
} as const;
describe('bound InputNumber', () => {
  it('shares nullable number edits and guards host range writes', async () => {
    const user = userEvent.setup();
    const registry = success(
      createStateRegistry([
        { key: 'quantity', kind: 'nullableNumber', access: 'readWrite', initial: 1 },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputNumber node={node} registry={registry} />
        <BoundInputNumber
          node={{ ...node, label: 'Reader', value: { ...reference, mode: 'read' } }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Increase Quantity' }));
    expect(success(registry.read('quantity')).value).toBe(2);
    expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveValue('2');
    expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveAttribute('readonly');
    await user.clear(screen.getByRole('textbox', { name: 'Quantity' }));
    expect(success(registry.read('quantity')).value).toBeNull();
    let rejected = false;
    act(() => {
      rejected = !registry.update('quantity', 11).success;
    });
    expect(rejected).toBe(true);
    expect(success(registry.read('quantity')).value).toBeNull();
  });
  it('applies default bounds and explicit read-only behavior', () => {
    const registry = success(
      createStateRegistry([
        { key: 'quantity', kind: 'nullableNumber', access: 'readWrite', initial: null },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputNumber
          node={{
            type: 'InputNumber',
            label: 'Amount',
            value: reference,
            readOnly: true,
          }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveAttribute('readonly');
  });
  it.each(
    [
      [],
      [{ key: 'quantity', kind: 'number', access: 'readWrite', initial: 1 }],
      [{ key: 'quantity', kind: 'nullableNumber', access: 'read', initial: 1 }],
      [{ key: 'quantity', kind: 'nullableNumber', access: 'readWrite', initial: 11 }],
    ].map((definitions) => ({ definitions })),
  )(
    'reports unavailable, wrong-kind, protected or out-of-range state',
    ({ definitions }) => {
      const registry = success(createStateRegistry(definitions));
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <BoundInputNumber node={node} registry={registry} />
        </ReacdProvider>,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    },
  );
});
