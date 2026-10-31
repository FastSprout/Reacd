import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundCheckbox } from './bound-checkbox.js';

const node = {
  type: 'Checkbox',
  label: 'Writer',
  checked: { state: 'checked', mode: 'readWrite' },
  indeterminate: { state: 'mixed', mode: 'read' },
} as const;

it('shares boolean readers and host-controlled mixed state', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'checked', kind: 'boolean', initial: false, access: 'readWrite' },
      { key: 'mixed', kind: 'boolean', initial: true, access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundCheckbox node={node} registry={registry} />
      <BoundCheckbox
        node={{
          ...node,
          label: 'Reader',
          indeterminate: false,
          checked: { state: 'checked', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundCheckbox
        node={{ ...node, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  const writer = screen.getByRole('checkbox', { name: 'Writer' });
  const reader = screen.getByRole('checkbox', { name: 'Reader' });
  await user.click(writer);
  expect(success(registry.read('checked')).value).toBe(true);
  expect(success(registry.read('mixed')).value).toBe(true);
  expect(writer).toHaveAttribute('aria-checked', 'mixed');
  expect(reader).toHaveAttribute('aria-checked', 'true');
  expect(reader).toHaveAttribute('aria-readonly', 'true');
  await user.click(reader);
  await user.click(screen.getByRole('checkbox', { name: 'Protected' }));
  expect(success(registry.read('checked')).value).toBe(true);
  act(() => {
    expect(registry.update('mixed', false).success).toBe(true);
  });
  expect(writer).toHaveAttribute('aria-checked', 'true');
  await user.click(writer);
  expect(success(registry.read('checked')).value).toBe(false);
  expect(reader).toHaveAttribute('aria-checked', 'false');
});

it('reports unresolved checked/mixed bindings without interactive controls', () => {
  const registry = success(createStateRegistry([]));
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundCheckbox node={node} registry={registry} />
      <BoundCheckbox node={{ ...node, indeterminate: false }} registry={registry} />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('checkbox')).toBeNull();
});
