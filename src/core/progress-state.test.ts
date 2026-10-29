import { expect, it } from 'vitest';
import { progressState } from './progress-state.js';
it('derives bounded percentages and explicit indeterminate text', () => {
  expect(progressState(25)).toEqual({ indeterminate: false, percent: 25, text: '25%' });
  expect(progressState(250, 500).text).toBe('50%');
  expect(progressState(1, 3).text).toBe('33.33%');
  expect(progressState(null)).toEqual({
    indeterminate: true,
    percent: 0,
    text: 'In progress',
  });
  expect(progressState(undefined).indeterminate).toBe(true);
});
