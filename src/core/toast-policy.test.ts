import { expect, it } from 'vitest';
import { toastDecision, toastTimeout, TOAST_DURATIONS } from './toast-policy.js';
it('uses named duration and decision policies', () => {
  expect(toastTimeout(undefined, false)).toBe(TOAST_DURATIONS.normal);
  expect(toastTimeout(undefined, true)).toBe(TOAST_DURATIONS.persistent);
  expect(toastTimeout('long', true)).toBe(TOAST_DURATIONS.long);
  expect(toastDecision(false)).toBe('veto');
  expect(toastDecision(undefined)).toBe('accept');
  expect(toastDecision(true)).toBe('accept');
  expect(toastDecision('invalid')).toBe('invalid');
});
