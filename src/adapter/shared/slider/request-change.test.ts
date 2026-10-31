import { expect, it, vi } from 'vitest';
import { requestSliderChange } from './request-change.js';

const bounds = { label: 'Level', min: 0, max: 100 };

it('rejects malformed SDK values and protected callbacks before host execution', () => {
  const change = vi.fn();
  const cancel = vi.fn();
  const single = { ...bounds, value: 20, onValueChange: change };
  for (const value of [[], [20], null, NaN, 101, -1])
    requestSliderChange(single, value, false, true, cancel);
  requestSliderChange(single, 25, true, true, cancel);
  requestSliderChange(single, 25, false, false, cancel);
  requestSliderChange({ ...single, readOnly: true }, 25, false, true, cancel);
  expect(cancel).toHaveBeenCalledTimes(9);
  expect(change).not.toHaveBeenCalled();
  requestSliderChange(single, 25, false, true, cancel);
  expect(change.mock.calls).toEqual([[25]]);
});

it('converts exactly two valid endpoints into a frozen ordered canonical DTO', () => {
  const change = vi.fn();
  const cancel = vi.fn();
  const range = {
    ...bounds,
    mode: 'range',
    value: { start: 20, end: 80 },
    onValueChange: change,
  } as const;
  for (const value of [20, [], [10], [10, 20, 30], [80, 20], [-1, 90], [0, 101]])
    requestSliderChange(range, value, false, true, cancel);
  expect(cancel).toHaveBeenCalledTimes(7);
  expect(change).not.toHaveBeenCalled();
  requestSliderChange(range, [30, 70], false, true, cancel);
  expect(change.mock.calls).toEqual([[{ start: 30, end: 70 }]]);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
});
