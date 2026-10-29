import { expect, it } from 'vitest';
import { calendarSchema } from './calendar.schema.js';
import { calendarNodeSchema } from './generative.schema.js';

const base = {
  label: 'Delivery date',
  referenceDate: '2026-10-29',
  value: null,
  onValueChange: () => undefined,
};

it('accepts controlled canonical single and partial or ordered range values', () => {
  for (const properties of [
    base,
    { ...base, value: '0001-01-01' },
    { ...base, value: '0099-12-31', locale: 'pl-PL', numberOfMonths: 2 },
    { ...base, mode: 'single', min: '2026-01-01', max: '2026-12-31' },
    { ...base, mode: 'range', value: { start: '2026-10-29', end: null } },
    { ...base, mode: 'range', value: { start: null, end: '2026-10-30' } },
    { ...base, mode: 'range', value: { start: null, end: null } },
    {
      ...base,
      mode: 'range',
      value: { start: '2026-10-29', end: '2026-10-30' },
    },
  ])
    expect(calendarSchema.safeParse(properties).success).toBe(true);
});

it('rejects wrong identities, ranges, canonical values and rendering escapes', () => {
  for (const change of [
    { label: '' },
    { referenceDate: '2026-02-30' },
    { referenceDate: undefined },
    { value: new Date(0) },
    { value: '2026-2-01' },
    { value: '2026-02-29' },
    { onValueChange: 'select' },
    { min: '2026-12-31', max: '2026-01-01' },
    { value: '2026-10-29', min: '2026-10-30' },
    { value: '2026-10-29', max: '2026-10-28' },
    { mode: 'range', value: { start: '2026-10-30', end: '2026-10-29' } },
    { mode: 'range', value: { start: null, end: '2026-10-30' }, max: '2026-10-29' },
    { mode: 'range', value: { start: null } },
    { mode: 'range', value: null },
    { mode: 'multiple' },
    { numberOfMonths: 0 },
    { numberOfMonths: 3 },
    { numberOfMonths: 1.5 },
    { weekStartsOn: 7 },
    { weekStartsOn: -1 },
    { weekStartsOn: 1.5 },
    { locale: 'not_a_locale' },
    { className: 'calendar' },
    { style: { width: 100 } },
    { onClick: () => undefined },
  ])
    expect(calendarSchema.safeParse({ ...base, ...change }).success).toBe(false);
});

it('keeps transport callbacks out and validates mode-specific state references', () => {
  const reference = { state: 'delivery', mode: 'readWrite' };
  const node = {
    type: 'Calendar',
    label: 'Delivery date',
    referenceDate: '2026-10-29',
    value: reference,
  };
  expect(calendarNodeSchema.safeParse(node).success).toBe(true);
  expect(calendarNodeSchema.safeParse({ ...node, mode: 'range' }).success).toBe(true);
  for (const change of [
    { value: { state: 'delivery', mode: 'write' } },
    { value: '2026-10-29' },
    { onValueChange: () => undefined },
    { min: '2026-12-31', max: '2026-01-01' },
  ])
    expect(calendarNodeSchema.safeParse({ ...node, ...change }).success).toBe(false);
});
