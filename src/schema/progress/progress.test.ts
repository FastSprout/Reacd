import { expect, it } from 'vitest';
import { progressSchema, boundedProgressValueSchema } from './progress.schema.js';

it('accepts explicit indeterminate progress and bounded custom maxima', () => {
  for (const change of [
    {},
    { value: null },
    { value: 0 },
    { value: 100 },
    { value: 250, max: 500, description: 'Half complete', showValue: false },
  ])
    expect(progressSchema.safeParse({ label: 'Upload', ...change }).success).toBe(true);
});
it('rejects nonfinite, out-of-range values and presentation escapes', () => {
  for (const change of [
    { value: -1 },
    { value: 101 },
    { value: 501, max: 500 },
    { value: Number.NaN },
    { value: Number.POSITIVE_INFINITY },
    { max: 0 },
    { max: -1 },
    { max: Number.POSITIVE_INFINITY },
    { max: Number.MAX_SAFE_INTEGER + 1 },
    { style: {} },
    { className: 'progress' },
  ])
    expect(progressSchema.safeParse({ label: 'Upload', ...change }).success).toBe(
      false,
    );
  expect(boundedProgressValueSchema(500).safeParse(500).success).toBe(true);
  expect(boundedProgressValueSchema(500).safeParse(null).success).toBe(true);
  expect(boundedProgressValueSchema(500).safeParse(undefined).success).toBe(true);
  expect(boundedProgressValueSchema(500).safeParse(501).success).toBe(false);
  expect(() => boundedProgressValueSchema(0)).toThrow();
  expect(boundedProgressValueSchema().safeParse(101).success).toBe(false);
});
