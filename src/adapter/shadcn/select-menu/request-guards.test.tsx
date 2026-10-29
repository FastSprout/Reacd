import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useSelectMenu } from './use-select-menu.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'beta', label: 'Beta' },
  { value: 'new', label: 'New choice' },
  { value: 'disabled', label: 'Unavailable', disabled: true },
];

it('preserves retained order and appends additions in one immutable proposal', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useSelectMenu({
      label: 'Guarded',
      items,
      mode: 'multiple',
      value: ['beta', '42'],
      onValueChange: change,
    }),
  );
  act(() => {
    expect(result.current.requestSelection(['42', 'beta'])).toBe(true);
  });
  expect(change).not.toHaveBeenCalled();
  act(() => {
    expect(result.current.requestSelection(['new', '42'])).toBe(true);
  });
  expect(change).toHaveBeenCalledExactlyOnceWith(['42', 'new']);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
});

it('rejects unknown, duplicate and newly disabled vendor proposals', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useSelectMenu({
      label: 'Guarded',
      items,
      mode: 'multiple',
      value: [],
      onValueChange: change,
    }),
  );
  act(() => {
    expect(result.current.requestSelection(['missing'])).toBe(false);
    expect(result.current.requestSelection(['42', '42'])).toBe(false);
    expect(result.current.requestSelection(['disabled'])).toBe(false);
  });
  expect(change).not.toHaveBeenCalled();
});

it('allows an empty editing request even when required and preserves query', () => {
  const change = vi.fn();
  const query = vi.fn();
  const { result } = renderHook(() =>
    useSelectMenu({
      label: 'Guarded',
      items,
      value: 'disabled',
      onValueChange: change,
      required: true,
      query: 'search',
      onQueryChange: query,
    }),
  );
  act(() => {
    expect(result.current.requestSelection([])).toBe(true);
  });
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(query).not.toHaveBeenCalled();
  expect(result.current.query).toBe('search');
});
