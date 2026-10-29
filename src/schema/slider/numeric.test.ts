import { expect, it } from 'vitest';
import { sliderSchema } from './slider.schema.js';
import { sliderNodeSchema, sliderNodeBindings } from './generative.schema.js';
import { sliderNumberSchema, sliderRangeSchema } from './value.schema.js';

const base = { label: 'Level', min: 0, max: 1, value: 0.3, onValueChange() {} };

it('shares supported precision across props, node validation and bound values', () => {
  expect(sliderSchema.safeParse({ ...base, step: 1e-12 }).success).toBe(true);
  for (const change of [
    { value: 1e-13 },
    { step: Number.MIN_VALUE },
    { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
    { max: 1e308 },
    { max: 1e306, step: 1e-12 },
    { min: 1e20, max: 1e20 + 1e6, value: 1e20, step: 1 },
    { mode: 'range', value: { start: 1e-13, end: 1 } },
  ])
    expect(sliderSchema.safeParse({ ...base, ...change }).success).toBe(false);
  const node = {
    type: 'Slider',
    label: 'Level',
    min: 0,
    max: 1,
    value: { state: 'level', mode: 'readWrite' },
  };
  expect(sliderNodeSchema.safeParse({ ...node, step: Number.MIN_VALUE }).success).toBe(
    false,
  );
  const range = sliderNodeSchema.parse({ ...node, mode: 'range' });
  expect(
    sliderNodeBindings(range)[0]?.schema?.safeParse({ start: 1e-13, end: 1 }).success,
  ).toBe(false);
  expect(sliderNumberSchema({ min: 0, max: 1 }).safeParse(1e-13).success).toBe(false);
  expect(
    sliderRangeSchema({ min: 0, max: 1 }).safeParse({ start: 0, end: 1e-13 }).success,
  ).toBe(false);
  expect(
    sliderRangeSchema({ min: 0, max: 1 }).safeParse({ start: 1e-12, end: 1 }).success,
  ).toBe(true);
});
