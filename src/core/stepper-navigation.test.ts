import { describe, expect, it } from 'vitest';
import { reachableStepKeys, stepFocusTarget } from './stepper-navigation.js';

const items = [
  { key: 'one' },
  { key: 'blocked', disabled: true },
  { key: 'two' },
  { key: 'three' },
];
describe('stepper navigation policy', () => {
  it('skips disabled steps and gates forward transitions in linear mode', () => {
    expect(reachableStepKeys(items, 'one', true)).toEqual(['one', 'two']);
    expect(reachableStepKeys(items, 'two', true)).toEqual(['one', 'two', 'three']);
    expect(reachableStepKeys(items, 'one', false)).toEqual(['one', 'two', 'three']);
    expect(reachableStepKeys([], 'missing', true)).toEqual([]);
  });
  it('moves focus for each orientation and direction without activating', () => {
    const keys = ['one', 'two', 'three'];
    for (const direction of ['ltr', 'rtl'] as const) {
      for (const orientation of ['horizontal', 'vertical'] as const) {
        const forward =
          orientation === 'vertical'
            ? 'ArrowDown'
            : direction === 'rtl'
              ? 'ArrowLeft'
              : 'ArrowRight';
        const back =
          orientation === 'vertical'
            ? 'ArrowUp'
            : direction === 'rtl'
              ? 'ArrowRight'
              : 'ArrowLeft';
        expect(stepFocusTarget(keys, 'one', forward, orientation, direction)).toBe(
          'two',
        );
        expect(stepFocusTarget(keys, 'two', back, orientation, direction)).toBe('one');
        expect(stepFocusTarget(keys, 'one', back, orientation, direction)).toBe('one');
        expect(stepFocusTarget(keys, 'three', forward, orientation, direction)).toBe(
          'three',
        );
      }
    }
    expect(stepFocusTarget(keys, 'two', 'Home', 'vertical', 'ltr')).toBe('one');
    expect(stepFocusTarget(keys, 'two', 'End', 'vertical', 'ltr')).toBe('three');
    expect(stepFocusTarget(keys, 'two', 'Tab', 'vertical', 'ltr')).toBeUndefined();
  });
});
