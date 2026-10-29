import { describe, expect, it } from 'vitest';
import { pinInputSchema } from './pin-input.schema.js';
import { pinInputNodeSchema } from './generative.schema.js';

const base = { label: 'Code', value: '0012', onValueChange() {} };
describe('PinInput contract', () => {
  it('accepts binding modes and registered completion action identifiers', () => {
    for (const mode of ['read', 'readWrite']) {
      const node = {
        type: 'PinInput',
        label: 'Code',
        value: { state: 'code', mode },
        completeAction: 'verify',
      };
      expect(pinInputNodeSchema.safeParse(node).success).toBe(true);
      expect(pinInputNodeSchema.safeParse({ ...node, separatorEvery: 2 }).success).toBe(
        true,
      );
      expect(
        pinInputNodeSchema.safeParse({ ...node, length: 4, separatorEvery: 4 }).success,
      ).toBe(false);
      expect(pinInputNodeSchema.safeParse({ ...node, onComplete() {} }).success).toBe(
        false,
      );
    }
  });
  it('preserves leading zeroes and allows incomplete controlled values', () => {
    expect(pinInputSchema.parse(base).value).toBe('0012');
    expect(pinInputSchema.safeParse({ ...base, value: '' }).success).toBe(true);
    expect(
      pinInputSchema.safeParse({
        ...base,
        value: 'aB12',
        inputType: 'alphanumeric',
        length: 4,
        separatorEvery: 2,
      }).success,
    ).toBe(true);
  });
  it.each([
    { length: 0 },
    { length: 13 },
    { length: 2 },
    { value: '12-3' },
    { value: 'a' },
    { value: '１' },
    { inputType: 'text' },
    { separatorEvery: 0 },
    { separatorEvery: 6 },
    { onComplete: 'callback' },
    { className: 'x' },
    { style: {} },
  ])('rejects invalid behavior or styling: %j', (properties) => {
    expect(pinInputSchema.safeParse({ ...base, ...properties }).success).toBe(false);
  });
});
