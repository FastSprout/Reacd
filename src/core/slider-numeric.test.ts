import { expect, it } from 'vitest';
import {
  hasSliderPrecision,
  validSliderBounds,
  validSliderNumbers,
} from './slider-numeric.js';

it('accepts exact supported decimals and rejects precision that the SDK rounds', () => {
  for (const value of [0, -1.23, 0.3, 1e-12, 1e20])
    expect(hasSliderPrecision(value)).toBe(true);
  for (const value of [1e-13, Number.MIN_VALUE, NaN, Infinity])
    expect(hasSliderPrecision(value)).toBe(false);
});

it('rejects overflowing span/percentage arithmetic before mounting', () => {
  expect(validSliderBounds({ min: 0, max: 100 })).toBe(true);
  for (const bounds of [
    { min: 1e-13, max: 1 },
    { min: 0, max: 1e-13 },
    { min: 1, max: 1 },
    { min: 2, max: 1 },
    { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
    { min: 0, max: 1e308 },
  ])
    expect(validSliderBounds(bounds)).toBe(false);
});

it('requires finite quotients and step increments representable at both bounds', () => {
  for (const properties of [
    { min: 0, max: 100 },
    { min: 0, max: 1, step: 1e-12 },
    { min: 0, max: 1e-12, step: 1e-12 },
    { min: 0, max: 100, step: 1e308 },
    { min: 1e20, max: 1e20 + 1e6, step: 1e5 },
  ])
    expect(validSliderNumbers(properties)).toBe(true);
  for (const properties of [
    { min: 1, max: 0 },
    { min: 0, max: 100, step: 0 },
    { min: 0, max: 100, step: Number.MIN_VALUE },
    { min: 0, max: 1e306, step: 1e-12 },
    { min: 1e20, max: 1e20 + 1e6, step: 1 },
    { min: 0, max: 1e20, step: 1 },
  ])
    expect(validSliderNumbers(properties)).toBe(false);
});
