import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInputTime } from './bound-input-time.js';

const singleNode = {
  type: 'InputTime',
  label: 'Arrival',
  value: { state: 'arrival', mode: 'readWrite' },
  min: '09:00:00',
  max: '17:00:00',
} as const;
const rangeNode = {
  ...singleNode,
  mode: 'range',
  label: 'Shift',
  value: { state: 'shift', mode: 'readWrite' },
} as const;

it('shares time edits, protects readers and constrains host updates', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'arrival', kind: 'time', initial: '12:00:00', access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundInputTime node={singleNode} registry={registry} />
      <BoundInputTime
        node={{
          ...singleNode,
          label: 'Reader',
          value: { state: 'arrival', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /hour, Arrival/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(success(registry.read('arrival')).value).toBe('13:00:00');
  expect(screen.getByRole('spinbutton', { name: /hour, Reader/i })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await user.click(screen.getByRole('button', { name: 'Clear Arrival' }));
  expect(success(registry.read('arrival')).value).toBeNull();
  act(() => {
    expect(registry.update('arrival', '18:00:00').success).toBe(false);
  });
});

it('binds independent range endpoints and protects read-only views', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      {
        key: 'shift',
        kind: 'timeRange',
        access: 'readWrite',
        initial: { start: '09:00:00', end: '17:00:00' },
      },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundInputTime node={rangeNode} registry={registry} />
      <BoundInputTime
        node={{ ...rangeNode, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Clear End Shift' }));
  expect(success(registry.read('shift')).value).toEqual({
    start: '09:00:00',
    end: null,
  });
  await user.click(screen.getByRole('button', { name: 'Clear Start Shift' }));
  expect(success(registry.read('shift')).value).toEqual({ start: null, end: null });
  expect(screen.getByRole('button', { name: 'Clear Start Protected' })).toBeDisabled();
  act(() => {
    expect(
      registry.update('shift', { start: '17:00:00', end: '09:00:00' }).success,
    ).toBe(false);
  });
});

it('reports invalid single/range bindings without rendering editable fields', () => {
  const registry = success(createStateRegistry([]));
  render(
    <ReacdProvider>
      <BoundInputTime node={singleNode} registry={registry} />
      <BoundInputTime node={rangeNode} registry={registry} />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('spinbutton')).toBeNull();
});
