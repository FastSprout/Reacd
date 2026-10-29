import { describe, expect, it } from 'vitest';
import { inputNumberSchema } from './input-number.schema.js';
import { inputNumberNodeSchema } from './generative.schema.js';

const base = { label: 'Quantity', value: 2, onValueChange() {} };
describe('InputNumber contract', () => {
  it('accepts declarative read/write bindings and validates numeric ranges', () => {
    for (const mode of ['read', 'readWrite']) {
      const node = {
        type: 'InputNumber',
        label: 'Count',
        value: { state: 'count', mode },
      };
      expect(inputNumberNodeSchema.safeParse(node).success).toBe(true);
      expect(
        inputNumberNodeSchema.safeParse({ ...node, min: 0, max: 10 }).success,
      ).toBe(true);
      expect(
        inputNumberNodeSchema.safeParse({ ...node, min: 10, max: 0 }).success,
      ).toBe(false);
    }
  });
  it('accepts empty values and closed localized numeric formats', () => {
    expect(inputNumberSchema.safeParse({ ...base, value: null }).success).toBe(true);
    expect(
      inputNumberSchema.safeParse({
        ...base,
        locale: 'de-DE',
        format: { style: 'currency', currency: 'EUR' },
      }).success,
    ).toBe(true);
    expect(inputNumberSchema.safeParse({ ...base, min: 2, max: 2 }).success).toBe(true);
  });
  it.each([
    { value: Infinity },
    { value: NaN },
    { value: Number.MAX_VALUE },
    { step: 0 },
    { step: -1 },
    { min: 3 },
    { max: 1 },
    { min: 3, max: 1 },
    { locale: 'bad_locale' },
    { locale: 'zz-ZZ' },
    { format: { style: 'currency' } },
    { format: { style: 'decimal', currency: 'USD' } },
    { format: { maximumFractionDigits: 13 } },
    { format: { minimumFractionDigits: 3, maximumFractionDigits: 2 } },
    { style: {} },
    { className: 'x' },
    { onValueChange: 'callback' },
  ])('rejects invalid behavior or styling: %j', (properties) => {
    expect(inputNumberSchema.safeParse({ ...base, ...properties }).success).toBe(false);
  });
});
