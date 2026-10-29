import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundSelect } from './bound-select.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const base = { type: 'Select', label: 'Choice', items, clearable: true } as const;

it('shares scalar and array writes with readonly readers', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'single', kind: 'text', initial: 'a', access: 'readWrite' },
      { key: 'many', kind: 'selection', initial: ['a'], access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundSelect
        node={{ ...base, value: { state: 'single', mode: 'readWrite' } }}
        registry={registry}
      />
      <BoundSelect
        node={{
          ...base,
          label: 'Reader',
          value: { state: 'single', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundSelect
        node={{
          ...base,
          label: 'Many',
          mode: 'multiple',
          value: { state: 'many', mode: 'readWrite' },
        }}
        registry={registry}
      />
      <BoundSelect
        node={{
          ...base,
          label: 'Many reader',
          mode: 'multiple',
          value: { state: 'many', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Choice' });
  act(() => trigger.focus());
  await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
  expect(success(registry.read('single')).value).toBe('b');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveTextContent('Beta');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await user.click(screen.getByRole('button', { name: 'Clear Many' }));
  expect(success(registry.read('many')).value).toEqual([]);
  expect(screen.getByRole('combobox', { name: 'Many reader' })).toHaveTextContent(
    'Choose an option.',
  );
  expect(screen.getByRole('button', { name: 'Clear Many reader' })).toBeDisabled();
});

it('reports missing or incompatible scalar and array bindings', () => {
  const registry = success(createStateRegistry([]));
  render(
    <ReacdProvider>
      <BoundSelect
        node={{ ...base, value: { state: 'missing', mode: 'read' } }}
        registry={registry}
      />
      <BoundSelect
        node={{
          ...base,
          mode: 'multiple',
          value: { state: 'missing', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('combobox')).toBeNull();
});
