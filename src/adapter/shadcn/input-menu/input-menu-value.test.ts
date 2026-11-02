import { expect, it, vi } from 'vitest';
import { activateSuggestion } from './input-menu-value.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
];
const base = { label: 'City', value: '', items, onValueChange: vi.fn() };
const request = <Value>(
  callback: ((value: Value) => boolean | void) | undefined,
  value: Value,
) => callback?.(value) !== false;

it('ignores SDK empty-selection bookkeeping and rejects protected keys', () => {
  const text = vi.fn();
  expect(activateSuggestion(base, null, true, request, text)).toBe(true);
  expect(activateSuggestion(base, 'a', true, request, text)).toBe(false);
  expect(
    activateSuggestion({ ...base, status: 'loading' }, 'a', false, request, text),
  ).toBe(false);
  expect(activateSuggestion(base, 'missing', false, request, text)).toBe(false);
  expect(activateSuggestion(base, 'b', false, request, text)).toBe(false);
  expect(text).not.toHaveBeenCalled();
});

it('provides a readonly exact-key preflight before requesting text', () => {
  const text = vi.fn(() => true);
  const preflight = vi.fn(
    (value: { readonly value: string; readonly text: string }) => {
      expect(Object.isFrozen(value)).toBe(true);
    },
  );
  expect(
    activateSuggestion(
      { ...base, onSuggestionSelect: preflight },
      'a',
      false,
      request,
      text,
    ),
  ).toBe(true);
  expect(preflight).toHaveBeenCalledExactlyOnceWith({ value: 'a', text: 'Alpha' });
  expect(text).toHaveBeenCalledExactlyOnceWith('Alpha');
});
