import { expect, it } from 'vitest';
import { inputTimeSchema } from './input-time.schema.js';
import { inputTimeNodeSchema } from './generative.schema.js';

const single = { label: 'Arrival', value: '12:00:00', onValueChange() {} };
const range = {
  label: 'Hours',
  mode: 'range',
  value: { start: '09:00:00', end: '17:00:00' },
  onValueChange() {},
};

it('accepts canonical controlled single and partial range declarations', () => {
  expect(inputTimeSchema.safeParse(single).success).toBe(true);
  expect(inputTimeSchema.safeParse({ ...single, value: null }).success).toBe(true);
  expect(
    inputTimeSchema.safeParse({
      ...single,
      mode: 'single',
      description: 'Local time',
      locale: 'pl-PL',
      min: '11:00:00',
      max: '13:00:00',
      name: 'arrival',
      disabled: true,
      readOnly: true,
      required: true,
    }).success,
  ).toBe(true);
  for (const value of [
    range.value,
    { start: null, end: null },
    { start: null, end: '12:00:00' },
    { start: '12:00:00', end: null },
  ])
    expect(inputTimeSchema.safeParse({ ...range, value }).success).toBe(true);
});

it.each([
  { ...single, value: '24:00:00' },
  { ...single, value: '12:00' },
  { ...single, value: {} },
  { ...single, value: range.value },
  { ...single, min: '13:00:00' },
  { ...single, max: '11:00:00' },
  { ...single, min: '13:00:00', max: '11:00:00' },
  { ...single, mode: 'clock' },
  { ...single, className: 'custom' },
  { ...single, style: { color: 'red' } },
  { ...single, onChange() {} },
  { ...single, onValueChange: 'action' },
  { ...single, label: '' },
  { ...single, locale: 'not_a_locale' },
  { ...range, value: '12:00:00' },
  { ...range, value: { start: '17:00:00', end: '09:00:00' } },
  { ...range, min: '10:00:00' },
  { ...range, max: '16:00:00' },
  { ...range, min: '18:00:00', max: '08:00:00' },
  { ...range, onValueChange: null },
])('rejects invalid or escaped time declarations: %j', (properties) => {
  expect(inputTimeSchema.safeParse(properties).success).toBe(false);
});

it('validates literal generative modes without executable callbacks', () => {
  for (const mode of ['read', 'readWrite']) {
    for (const componentMode of ['single', 'range', undefined]) {
      const node = {
        type: 'InputTime',
        mode: componentMode,
        label: 'Arrival',
        min: '08:00:00',
        max: '18:00:00',
        value: { state: 'arrival', mode },
      };
      expect(inputTimeNodeSchema.safeParse(node).success).toBe(true);
      expect(
        inputTimeNodeSchema.safeParse({ ...node, onValueChange() {} }).success,
      ).toBe(false);
      expect(inputTimeNodeSchema.safeParse({ ...node, min: '19:00:00' }).success).toBe(
        false,
      );
    }
  }
});
