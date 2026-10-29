import { expect, it, vi } from 'vitest';
import { invokeMenuRadio, menuDecision } from './action-menu-policy.js';
it('accepts synchronous decisions and fails closed on other runtime results', () => {
  expect(menuDecision(undefined)).toBe('accept');
  expect(menuDecision(true)).toBe('accept');
  expect(menuDecision(false)).toBe('veto');
  expect(menuDecision(Promise.resolve())).toBe('invalid');
  expect(menuDecision('yes')).toBe('invalid');
});
it('validates third-party radio values before entering a typed host callback', () => {
  const onValueChange = vi.fn();
  const item = { options: [{ value: 'one' }], onValueChange };
  expect(invokeMenuRadio(item, null)).toBe('The radio value is not declared.');
  expect(invokeMenuRadio(item, 'missing')).toBe('The radio value is not declared.');
  expect(onValueChange).not.toHaveBeenCalled();
  expect(invokeMenuRadio(item, 'one')).toBeUndefined();
  expect(onValueChange).toHaveBeenCalledWith('one');
});
