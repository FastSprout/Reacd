import { expect, it, vi } from 'vitest';
import { requestContextChange } from './native-change.js';

it('delegates dismissal while preserving native state requests', () => {
  const cancel = vi.fn();
  const change = vi.fn();
  requestContextChange(false, { reason: 'escape-key', cancel }, change);
  requestContextChange(false, { reason: 'outside-press', cancel }, change);
  expect(cancel).toHaveBeenCalledTimes(2);
  expect(change).not.toHaveBeenCalled();
  requestContextChange(true, { reason: 'trigger-press', cancel }, change);
  expect(change).toHaveBeenCalledWith(true);
  requestContextChange(false, { reason: 'item-press', cancel }, change);
  expect(change).toHaveBeenLastCalledWith(false);
});
