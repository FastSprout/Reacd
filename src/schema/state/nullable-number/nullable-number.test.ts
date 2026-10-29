import { describe, expect, it } from 'vitest';
import { nullableNumberStateSchema } from './nullable-number.schema.js';
describe('nullable numeric definitions', () => {
  it('represents genuine empty values and finite numeric values', () => {
    for (const initial of [null, 0, -1, 1.25]) {
      expect(
        nullableNumberStateSchema.safeParse({
          key: 'amount',
          kind: 'nullableNumber',
          access: 'readWrite',
          initial,
        }).success,
      ).toBe(true);
    }
    for (const initial of [undefined, NaN, Infinity, '1']) {
      expect(
        nullableNumberStateSchema.safeParse({
          key: 'amount',
          kind: 'nullableNumber',
          access: 'readWrite',
          initial,
        }).success,
      ).toBe(false);
    }
  });
});
