import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { SelectProps } from '../../../components/select/index.js';
import { useSelectChange } from './use-select-change.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'retired', label: 'Retired', disabled: true },
];

it('rejects malformed SDK values and maps null to empty', () => {
  const change = vi.fn();
  const properties: SelectProps = {
    label: 'Status',
    value: 'a',
    items,
    onValueChange: change,
  };
  const { result } = renderHook(() => useSelectChange(properties, false, true));
  for (const candidate of ['missing', 'retired', ['a'], {}, undefined]) {
    result.current(candidate);
  }
  expect(change).not.toHaveBeenCalled();
  result.current('b');
  result.current(null);
  expect(change.mock.calls).toEqual([['b'], ['']]);
});

it('validates multiple membership and existing disabled values', () => {
  const change = vi.fn();
  const properties: SelectProps = {
    mode: 'multiple',
    label: 'Statuses',
    value: ['retired'],
    items,
    onValueChange: change,
  };
  const { result } = renderHook(() => useSelectChange(properties, false, true));
  for (const candidate of [null, 'a', ['missing'], ['a', 'a']])
    result.current(candidate);
  expect(change).not.toHaveBeenCalled();
  result.current(['retired', 'a']);
  result.current([]);
  expect(change.mock.calls).toEqual([[['retired', 'a']], [[]]]);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
});

it.each([
  { disabled: true },
  { readOnly: true },
  { loading: true },
  { inactive: true },
])('prevents protected SDK callbacks: %j', (protection) => {
  const change = vi.fn();
  const properties: SelectProps = {
    label: 'Status',
    value: 'a',
    items,
    onValueChange: change,
    ...protection,
  };
  const { result } = renderHook(() =>
    useSelectChange(properties, 'disabled' in protection, !('inactive' in protection)),
  );
  result.current('b');
  expect(change).not.toHaveBeenCalled();
});

it('rejects a newly selected disabled option in multiple mode', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useSelectChange(
      {
        mode: 'multiple',
        label: 'Locked',
        value: [],
        items,
        onValueChange: change,
      },
      false,
      true,
    ),
  );
  result.current(['retired']);
  expect(change).not.toHaveBeenCalled();
});
