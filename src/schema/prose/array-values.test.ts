import { expect, it, vi } from 'vitest';
import { proseArrayValues } from './array-values.js';
import { boundedProse } from './budget.js';
it('reads plain data and rejects accessor arrays without executing code', () => {
  expect(proseArrayValues([1, 'text'])).toEqual([1, 'text']);
  const get = vi.fn<() => number>(() => 1);
  const getter = [0];
  Object.defineProperty(getter, '0', { get });
  expect(proseArrayValues(getter)).toBeNull();
  expect(get).not.toHaveBeenCalled();
  expect(boundedProse(getter)).toBe(false);
  const setter = [0];
  Object.defineProperty(setter, '0', { set(_value: unknown) {} });
  expect(proseArrayValues(setter)).toBeNull();
});
it('rejects exotic prototypes, extra keys, symbols and sparse entries', () => {
  class Exotic extends Array<unknown> {}
  expect(proseArrayValues(new Exotic())).toBeNull();
  const extra = [0];
  Object.defineProperty(extra, 'custom', { value: true });
  expect(proseArrayValues(extra)).toBeNull();
  const symbol = [0];
  Object.defineProperty(symbol, Symbol('extra'), { value: true });
  expect(proseArrayValues(symbol)).toBeNull();
  const sparse: unknown[] = [];
  sparse.length = 1;
  expect(proseArrayValues(sparse)).toBeNull();
  const holes: unknown[] = [];
  holes.length = 1;
  Object.defineProperty(holes, 'custom', { value: true });
  expect(proseArrayValues(holes)).toBeNull();
});

it('allows a plain null-prototype array', () => {
  const plain: unknown[] = [];
  Object.setPrototypeOf(plain, null);
  expect(proseArrayValues(plain)).toEqual([]);
});
