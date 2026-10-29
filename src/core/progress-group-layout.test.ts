import { expect, it } from 'vitest';
import { progressGroupLayout } from './progress-group-layout.js';

it('clamps each segment and normalizes total size without dividing by zero', () => {
  expect(progressGroupLayout([{ value: -1 }, { value: 0 }], 100)).toEqual({
    value: 0,
    items: [
      { value: 0, percent: 0 },
      { value: 0, percent: 0 },
    ],
  });
  expect(progressGroupLayout([{ value: 25 }, { value: 50 }], 100)).toEqual({
    value: 75,
    items: [
      { value: 25, percent: 25 },
      { value: 50, percent: 50 },
    ],
  });
  expect(progressGroupLayout([{ value: 200 }, { value: 100 }], 100)).toEqual({
    value: 100,
    items: [
      { value: 100, percent: 50 },
      { value: 100, percent: 50 },
    ],
  });
});
