import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundCalendar } from './bound-calendar.js';
import { calendarNodeSchema } from '../../schema/calendar/index.js';

const single = calendarNodeSchema.parse({
  type: 'Calendar',
  label: 'Delivery date',
  referenceDate: '2026-10-29',
  min: '2026-10-28',
  max: '2026-10-31',
  value: { state: 'delivery', mode: 'readWrite' },
});
const range = calendarNodeSchema.parse({ ...single, mode: 'range' });
const day = (name: string, date: number) =>
  within(screen.getByRole('group', { name })).getByRole('button', {
    name: new RegExp(`October ${date}, 2026$`),
  });

it('shares dates, protects readers and intersects bounds', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'delivery', kind: 'date', initial: null, access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundCalendar node={single} registry={registry} />
      <BoundCalendar
        node={{
          ...single,
          label: 'Reader',
          value: { state: 'delivery', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundCalendar
        node={{ ...single, label: 'Readonly', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  await user.click(day('Delivery date', 29));
  expect(success(registry.read('delivery')).value).toBe('2026-10-29');
  expect(screen.getByRole('group', { name: 'Reader' })).toHaveAttribute(
    'data-readonly',
    'true',
  );
  expect(screen.getByRole('group', { name: 'Readonly' })).toHaveAttribute(
    'data-readonly',
    'true',
  );
  await user.click(day('Reader', 30));
  expect(success(registry.read('delivery')).value).toBe('2026-10-29');
  act(() => {
    expect(registry.update('delivery', '2026-11-01').success).toBe(false);
  });
  expect(success(registry.read('delivery')).value).toBe('2026-10-29');
});

it('commits date ranges with independent reader access', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      {
        key: 'delivery',
        kind: 'dateRange',
        initial: { start: null, end: null },
        access: 'readWrite',
      },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundCalendar node={range} registry={registry} />
      <BoundCalendar
        node={{ ...range, label: 'Reader', value: { state: 'delivery', mode: 'read' } }}
        registry={registry}
      />
      <BoundCalendar
        node={{ ...range, label: 'Readonly', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  await user.click(day('Delivery date', 29));
  expect(success(registry.read('delivery')).value).toEqual({
    start: '2026-10-29',
    end: null,
  });
  await user.click(day('Delivery date', 30));
  expect(success(registry.read('delivery')).value).toEqual({
    start: '2026-10-29',
    end: '2026-10-30',
  });
  await user.click(day('Reader', 31));
  expect(success(registry.read('delivery')).value).toEqual({
    start: '2026-10-29',
    end: '2026-10-30',
  });
  act(() => {
    expect(
      registry.update('delivery', { start: '2026-11-01', end: null }).success,
    ).toBe(false);
  });
});

it.each([
  { node: single, definitions: [] },
  { node: range, definitions: [] },
  {
    node: single,
    definitions: [{ key: 'delivery', kind: 'text', initial: '', access: 'readWrite' }],
  },
  {
    node: range,
    definitions: [{ key: 'delivery', kind: 'text', initial: '', access: 'readWrite' }],
  },
  {
    node: single,
    definitions: [
      { key: 'delivery', kind: 'date', initial: '2026-11-01', access: 'readWrite' },
    ],
  },
  {
    node: range,
    definitions: [
      {
        key: 'delivery',
        kind: 'dateRange',
        initial: { start: null, end: '2026-11-01' },
        access: 'readWrite',
      },
    ],
  },
])(
  'reports unavailable, mistyped and out-of-bounds references',
  ({ node, definitions }) => {
    const registry = success(createStateRegistry(definitions));
    render(
      <ReacdProvider>
        <BoundCalendar node={node} registry={registry} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  },
);
