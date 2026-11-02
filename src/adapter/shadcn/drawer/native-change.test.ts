import { expect, it, vi } from 'vitest';
import { requestDrawerChange } from './native-change.js';

it('delegates Escape to the native layer and vetoes locked native swipes', () => {
  const change = vi.fn();
  const cancel = vi.fn();
  requestDrawerChange(false, { reason: 'escape-key', cancel }, true, change);
  expect(cancel).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
  cancel.mockClear();
  requestDrawerChange(false, { reason: 'swipe', cancel }, false, change);
  expect(cancel).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
});

it('allows native trigger, close and unlocked swipe requests', () => {
  const change = vi.fn();
  const cancel = vi.fn();
  requestDrawerChange(true, { reason: 'trigger-press', cancel }, false, change);
  expect(change).toHaveBeenCalledWith(true);
  requestDrawerChange(false, { reason: 'close-press', cancel }, false, change);
  expect(change).toHaveBeenLastCalledWith(false);
  requestDrawerChange(false, { reason: 'swipe', cancel }, true, change);
  expect(change).toHaveBeenLastCalledWith(false);
  expect(cancel).not.toHaveBeenCalled();
});
