import { describe, expect, it } from 'vitest';
import { inputRatingSchema } from './input-rating.schema.js';

const base = { label: 'Quality', value: 3, onValueChange() {} };
describe('InputRating contract', () => {
  it('accepts whole, half, empty, protected and required ratings', () => {
    for (const properties of [
      {},
      { value: 0 },
      { step: 0.5, value: 3.5 },
      { length: 10, value: 10 },
      { disabled: true },
      { readOnly: true },
      { required: true, name: 'quality' },
    ]) {
      expect(inputRatingSchema.safeParse({ ...base, ...properties }).success).toBe(
        true,
      );
    }
  });
  it.each([
    { value: -1 },
    { value: 6 },
    { value: 2.5 },
    { value: Infinity },
    { step: 0.25 },
    { length: 0 },
    { length: 11 },
    { className: 'x' },
    { onValueChange: 'callback' },
  ])('rejects invalid ratings: %j', (properties) => {
    expect(inputRatingSchema.safeParse({ ...base, ...properties }).success).toBe(false);
  });
});
