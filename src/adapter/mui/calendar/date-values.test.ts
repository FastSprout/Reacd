import { expect, it, vi } from 'vitest';
import { canonicalDate, emitNativeDate, nativeDate, nativeDateLocale } from
  './date-values.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';

it('preserves civil dates and early years without UTC conversion', () => {
  for (const value of ['0001-01-01', '0099-12-31', '2026-11-16', null])
    expect(canonicalDate(nativeDate(value))).toBe(value);
  expect(canonicalDate(new Date('invalid'))).toBeUndefined();
  const outOfRange = new Date(0);
  outOfRange.setFullYear(10000);
  expect(canonicalDate(outOfRange)).toBeUndefined();
});

it('resolves exact SDK locales, language fallbacks and explicit exceptions', () => {
  expect(nativeDateLocale('Calendar').code).toBe('en-US');
  expect(nativeDateLocale('Calendar', 'de-DE').code).toBe('de');
  expect(nativeDateLocale('InputDate', 'en-GB').code).toBe('en-GB');
  expect(() => nativeDateLocale('Calendar', 'haw-US')).toThrow(
    new UnsupportedAdapterComponentError('material-ui', 'Calendar'),
  );
});

it('emits only valid canonical dates when interaction is allowed', () => {
  const change = vi.fn();
  emitNativeDate(change, nativeDate('2026-11-16'), false);
  expect(change).toHaveBeenLastCalledWith('2026-11-16');
  emitNativeDate(change, null, false);
  expect(change).toHaveBeenLastCalledWith(null);
  change.mockClear();
  emitNativeDate(change, nativeDate('2026-11-16'), true);
  emitNativeDate(change, new Date('invalid'), false);
  expect(change).not.toHaveBeenCalled();
});
