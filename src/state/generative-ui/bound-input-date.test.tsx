import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInputDate } from './bound-input-date.js';

const singleNode = {
  type: 'InputDate',
  label: 'Event',
  referenceDate: '2024-02-28',
  value: { state: 'event', mode: 'readWrite' },
  min: '2024-02-01',
  max: '2024-03-01',
} as const;
const rangeNode = {
  ...singleNode,
  mode: 'range',
  label: 'Booking',
  value: { state: 'booking', mode: 'readWrite' },
} as const;

it('shares dates, protects readers and constrains host writes', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'event', kind: 'date', initial: '2024-02-28', access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInputDate node={singleNode} registry={registry} />
      <BoundInputDate
        node={{
          ...singleNode,
          label: 'Reader',
          value: { state: 'event', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundInputDate
        node={{ ...singleNode, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /day, Event/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(success(registry.read('event')).value).toBe('2024-02-29');
  expect(screen.getByRole('spinbutton', { name: /day, Reader/i })).toHaveAttribute(
    'aria-valuenow',
    '29',
  );
  expect(screen.getByRole('button', { name: 'Clear Reader' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Clear Protected' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Clear Event' }));
  expect(success(registry.read('event')).value).toBeNull();
  act(() => {
    expect(registry.update('event', '2024-03-02').success).toBe(false);
  });
});

it('binds date ranges and protects shared access and limits', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      {
        key: 'booking',
        kind: 'dateRange',
        access: 'readWrite',
        initial: { start: '2024-02-28', end: '2024-03-01' },
      },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInputDate node={rangeNode} registry={registry} />
      <BoundInputDate
        node={{
          ...rangeNode,
          label: 'Read booking',
          value: { state: 'booking', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundInputDate
        node={{ ...rangeNode, label: 'Protected booking', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Clear End Booking' }));
  expect(success(registry.read('booking')).value).toEqual({
    start: '2024-02-28',
    end: null,
  });
  await user.click(screen.getByRole('button', { name: 'Clear Start Booking' }));
  expect(success(registry.read('booking')).value).toEqual({ start: null, end: null });
  expect(
    screen.getByRole('button', { name: 'Clear Start Read booking' }),
  ).toBeDisabled();
  act(() => {
    expect(
      registry.update('booking', {
        start: '2024-03-01',
        end: '2024-02-28',
      }).success,
    ).toBe(false);
  });
});

it('reports failed single and range binding resolution', () => {
  const registry = success(createStateRegistry([]));
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInputDate node={singleNode} registry={registry} />
      <BoundInputDate node={rangeNode} registry={registry} />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('spinbutton')).toBeNull();
});
