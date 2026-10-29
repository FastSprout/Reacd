import { expect, expectTypeOf, it } from 'vitest';
import type { SliderProps } from '../../components/slider/index.js';
import { sliderSchema } from './slider.schema.js';
import { sliderNodeSchema, sliderNodeBindings } from './generative.schema.js';
import { sliderNumberSchema } from './value.schema.js';

const base = { label: 'Volume', value: 25, min: 0, max: 100, onValueChange() {} };

it('preserves single numbers and adds ordered finite ranges with closed props', () => {
  expect(sliderSchema.safeParse(base).success).toBe(true);
  expect(
    sliderSchema.safeParse({
      ...base,
      mode: 'range',
      value: { start: 10, end: 90 },
      orientation: 'vertical',
      readOnly: true,
      description: 'Interval',
      name: 'interval',
    }).success,
  ).toBe(true);
  for (const invalid of [
    { min: 100 },
    { max: -10 },
    { value: 101 },
    { value: -1 },
    { value: Infinity },
    { step: 0 },
    { mode: 'range', value: [10, 90] },
    { mode: 'range', value: { start: 90, end: 10 } },
    { mode: 'range', value: { start: -1, end: 10 } },
    { mode: 'range', value: { start: 10, end: 101 } },
    { className: 'escape' },
  ])
    expect(sliderSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  expect(
    sliderSchema.safeParse({ ...base, mode: 'range', value: { start: 20, end: 20 } })
      .success,
  ).toBe(true);
  expectTypeOf<Extract<SliderProps, { mode: 'range' }>['value']>().toEqualTypeOf<
    Readonly<{ start: number; end: number }>
  >();
});

it('validates scalar bounds and declares number or numberRange transport', () => {
  const schema = sliderNumberSchema({ min: 0, max: 100 });
  expect(schema.safeParse(0).success).toBe(true);
  expect(schema.safeParse(100).success).toBe(true);
  expect(schema.safeParse(101).success).toBe(false);
  expect(() => sliderNumberSchema({ min: 1, max: 1 })).toThrow();
  const node = {
    type: 'Slider',
    label: 'Level',
    min: 0,
    max: 100,
    value: { state: 'level', mode: 'readWrite' },
  };
  const single = sliderNodeSchema.parse(node);
  const range = sliderNodeSchema.parse({ ...node, mode: 'range' });
  expect(sliderNodeBindings(single)[0]?.kinds).toEqual(['number']);
  expect(sliderNodeBindings(range)[0]?.kinds).toEqual(['numberRange']);
  expect(
    sliderNodeBindings(range)[0]?.schema?.safeParse({ start: 0, end: 101 }).success,
  ).toBe(false);
  expect(sliderNodeSchema.safeParse({ ...node, min: 100 }).success).toBe(false);
});
