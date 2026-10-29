import { expect, it } from 'vitest';
import { z } from 'zod';
import { numberRangeSchema, boundedNumberRangeSchema } from './index.js';

it('validates readonly closed finite number ranges and inclusive bounds', () => {
  const value = numberRangeSchema.parse({ start: -2.5, end: 9.75 });
  expect(Object.isFrozen(value)).toBe(true);
  for (const invalid of [
    { start: 2, end: 1 },
    { start: NaN, end: 0 },
    { start: 0, end: Infinity },
    { start: null, end: 2 },
    { start: 1, end: 2, extra: true },
    [1, 2],
  ]) {
    expect(numberRangeSchema.safeParse(invalid).success).toBe(false);
  }
  const bounded = boundedNumberRangeSchema({ min: 0, max: 10 });
  expect(bounded.safeParse({ start: 0, end: 10 }).success).toBe(true);
  expect(bounded.safeParse({ start: 3, end: 3 }).success).toBe(true);
  expect(bounded.safeParse({ start: -1, end: 10 }).success).toBe(false);
  expect(bounded.safeParse({ start: 0, end: 11 }).success).toBe(false);
  expect(
    boundedNumberRangeSchema({ min: 0 }).safeParse({ start: 0, end: 1 }).success,
  ).toBe(true);
  expect(
    boundedNumberRangeSchema({ max: 0 }).safeParse({ start: -1, end: 0 }).success,
  ).toBe(true);
  expect(boundedNumberRangeSchema().safeParse({ start: 0, end: 0 }).success).toBe(true);
  for (const bounds of [{ min: 2, max: 1 }, { min: NaN }, { max: Infinity }]) {
    expect(() => boundedNumberRangeSchema(bounds)).toThrow();
  }
});

it('exports numeric min/max and retains runtime ordering checks', () => {
  const exported = z.toJSONSchema(boundedNumberRangeSchema({ min: 0, max: 10 }));
  expect(exported['properties']).toMatchObject({
    start: { type: 'number', minimum: 0, maximum: 10 },
    end: { type: 'number', minimum: 0, maximum: 10 },
  });
});
