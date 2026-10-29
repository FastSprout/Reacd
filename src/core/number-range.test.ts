import { expect, it } from 'vitest';
import { isOrderedNumberRange } from './number-range.js';

it('accepts finite ordered endpoints and rejects invalid pairs', () => {
  for (const value of [
    { start: 0, end: 0 },
    { start: -2.5, end: 9.75 },
    { start: -Number.MAX_VALUE, end: Number.MAX_VALUE },
  ]) {
    expect(isOrderedNumberRange(value)).toBe(true);
  }
  for (const value of [
    { start: NaN, end: 0 },
    { start: 0, end: Infinity },
    { start: -Infinity, end: Infinity },
    { start: 1, end: 0 },
  ]) {
    expect(isOrderedNumberRange(value)).toBe(false);
  }
});
