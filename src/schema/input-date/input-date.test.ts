import { expect, it } from 'vitest';
import { inputDateSchema } from './input-date.schema.js';
import { inputDateNodeSchema } from './generative.schema.js';

const single = {
  label: 'Event date',
  value: '2024-02-29',
  referenceDate: '2024-02-28',
  onValueChange() {},
};
const range = {
  ...single,
  mode: 'range',
  value: { start: '2024-02-28', end: '2024-03-01' },
};

it('accepts canonical dates, explicit references and partial ranges', () => {
  expect(inputDateSchema.safeParse(single).success).toBe(true);
  expect(inputDateSchema.safeParse({ ...single, value: null }).success).toBe(true);
  expect(
    inputDateSchema.safeParse({
      ...single,
      min: '2024-02-29',
      max: '2024-03-01',
      description: 'Gregorian date',
      locale: 'ja-JP-u-ca-japanese',
      name: 'event',
      required: true,
      disabled: true,
      readOnly: true,
    }).success,
  ).toBe(true);
  for (const value of [
    range.value,
    { start: null, end: null },
    { start: null, end: '2024-02-29' },
    { start: '2024-02-29', end: null },
  ])
    expect(inputDateSchema.safeParse({ ...range, value }).success).toBe(true);
});

it.each([
  { ...single, referenceDate: undefined },
  { ...single, referenceDate: null },
  { ...single, referenceDate: '2024-02-30' },
  { ...single, value: '2024-02-30' },
  { ...single, value: '1900-02-29' },
  { ...single, value: '2024-02-29T00:00:00Z' },
  { ...single, value: new Date('2024-02-29T00:00:00Z') },
  { ...single, value: range.value },
  { ...single, min: '2024-03-01' },
  { ...single, max: '2024-02-28' },
  { ...single, min: '2024-03-01', max: '2024-02-28' },
  { ...single, mode: 'calendar' },
  { ...single, className: 'custom' },
  { ...single, style: {} },
  { ...single, onChange() {} },
  { ...single, onValueChange: 'action' },
  { ...single, locale: 'not_a_locale' },
  { ...range, value: '2024-02-29' },
  { ...range, value: { start: '2024-03-01', end: '2024-02-28' } },
  { ...range, min: '2024-02-29' },
  { ...range, max: '2024-02-29' },
  { ...range, min: '2024-03-01', max: '2024-02-28' },
  { ...range, onValueChange: null },
])('rejects invalid, mismatched or escaped date props: %j', (properties) => {
  expect(inputDateSchema.safeParse(properties).success).toBe(false);
});

it('validates generative bindings and requires a reference date', () => {
  for (const mode of ['read', 'readWrite']) {
    for (const componentMode of ['single', 'range', undefined]) {
      const node = {
        type: 'InputDate',
        label: 'Event date',
        mode: componentMode,
        referenceDate: '2024-02-28',
        min: '2024-01-01',
        max: '2024-12-31',
        value: { state: 'event', mode },
      };
      expect(inputDateNodeSchema.safeParse(node).success).toBe(true);
      expect(
        inputDateNodeSchema.safeParse({ ...node, onValueChange() {} }).success,
      ).toBe(false);
      expect(
        inputDateNodeSchema.safeParse({ ...node, referenceDate: null }).success,
      ).toBe(false);
      expect(
        inputDateNodeSchema.safeParse({ ...node, min: '2025-01-01' }).success,
      ).toBe(false);
    }
  }
});
