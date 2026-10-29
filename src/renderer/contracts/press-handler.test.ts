import { expect, it, vi } from 'vitest';
import { pressHandler } from './press-handler.js';

it('omits absent actions and calls declared actions without native arguments', () => {
  expect(pressHandler(undefined)).toBeUndefined();
  const action = vi.fn();
  const callback = pressHandler(action);
  if (callback === undefined) throw new Error('Expected action adapter.');
  callback();
  expect(action).toHaveBeenCalledWith();
});
