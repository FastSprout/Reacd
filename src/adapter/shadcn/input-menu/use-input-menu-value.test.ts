import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { menuTextChangeSchema } from
  '../../../schema/form-menu-shared/menu.schema.js';
import { FORM_MENU_DEFAULTS } from '../../../core/form-menu-policy.js';
import { useInputMenuValue } from './use-input-menu-value.js';

const base = { label: 'City', value: 'Paris', items: [], onValueChange: vi.fn() };

it('protects canonical text, rejects invalid input and avoids no-op writes', () => {
  const accepted = vi.fn();
  const { result, rerender } = renderHook(
    ({ blocked }) => useInputMenuValue(base, blocked, accepted),
    { initialProps: { blocked: true } },
  );
  act(() => expect(result.current.requestText('Vienna')).toBe(false));
  rerender({ blocked: false });
  act(() => expect(result.current.requestText('Bad\ntext')).toBe(false));
  expect(result.current.error).toBe(FORM_MENU_DEFAULTS.invalidText);
  act(() => expect(result.current.requestText('Paris')).toBe(true));
  expect(base.onValueChange).not.toHaveBeenCalled();
  act(() => expect(result.current.requestText('Vienna')).toBe(true));
  expect(accepted).toHaveBeenCalledExactlyOnceWith('Vienna');
});

it('does not notify form state for a rejected logical write', () => {
  const accepted = vi.fn();
  const { result } = renderHook(() =>
    useInputMenuValue({ ...base, onValueChange: () => false }, false, accepted),
  );
  act(() => expect(result.current.requestText('Vienna')).toBe(false));
  expect(accepted).not.toHaveBeenCalled();
});

it('keeps callback diagnostics distinct from an earlier invalid text request', () => {
  const { result } = renderHook(() => useInputMenuValue(base, false));
  act(() => expect(result.current.requestText('Bad\ntext')).toBe(false));
  act(() => expect(result.current.request(
    menuTextChangeSchema.parse(() => Promise.resolve(true)), 'Paris',
  )).toBe(false));
  expect(result.current.error).toBe(FORM_MENU_DEFAULTS.callbackError);
});
