import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import type { ListboxProps } from '../../../components/listbox/index.js';
import type { SelectionOption } from '../../../schema/selection/index.js';
import { listboxSingleChangeSchema } from '../../../schema/listbox/index.js';
import { useListboxRequest } from './use-listbox-request.js';

const items: readonly SelectionOption[] = [
  { value: '42', label: 'Answer' },
  { value: 'b', label: 'Beta' },
  { value: 'old', label: 'Old', disabled: true },
];

it('validates complete requests and preserves immutable host vectors', () => {
  const change = vi.fn((next: readonly string[]) => {
    expect(Object.isFrozen(next)).toBe(true);
    expect(Reflect.set(next, 0, 'corrupt')).toBe(false);
    return true;
  });
  const value = Object.freeze(['old', 'b']);
  const { result } = renderHook(() =>
    useListboxRequest({
      label: 'Choice',
      mode: 'multiple',
      items,
      value,
      onValueChange: change,
    }),
  );
  act(() => {
    result.current.select(new Set(['42', 'old', 'b']));
  });
  expect(change).toHaveBeenCalledExactlyOnceWith(['old', 'b', '42']);
  expect(value).toEqual(['old', 'b']);
  act(() => {
    result.current.request(['b', 'b']);
  });
  act(() => {
    result.current.select(new Set([42]));
  });
  expect(change).toHaveBeenCalledOnce();
  expect(result.current.failure).toBeDefined();
  act(() => {
    result.current.request([]);
  });
  expect(change).toHaveBeenLastCalledWith([]);
  expect(result.current.failure).toBeUndefined();
});

it('treats equivalent props as the same basis and recovers on host replacement', () => {
  const change = vi.fn(() => false);
  const initial: ListboxProps = {
    label: 'Choice',
    items,
    value: '42',
    onValueChange: change,
  };
  const { result, rerender } = renderHook(
    (properties: ListboxProps) => useListboxRequest(properties),
    { initialProps: initial },
  );
  act(() => {
    result.current.request(['b']);
  });
  expect(result.current.failure).toBeDefined();
  rerender({
    ...initial,
    mode: 'single',
    disabled: false,
    readOnly: false,
    status: 'ready',
    items: items.map((item) => ({ ...item, disabled: item.disabled ?? false })),
  });
  expect(result.current.failure).toBeDefined();
  rerender({ ...initial, value: 'b' });
  expect(result.current.failure).toBeUndefined();
  expect(change).toHaveBeenCalledExactlyOnceWith('b');
});

it('guards single cardinality, no-op requests and unavailable additions', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useListboxRequest({
      label: 'Choice',
      items,
      value: '42',
      onValueChange: change,
    }),
  );
  act(() => {
    result.current.request(['42', 'b']);
  });
  act(() => {
    result.current.request(['old']);
  });
  act(() => {
    result.current.select('all');
  });
  expect(change).not.toHaveBeenCalled();
  expect(result.current.failure).toBeDefined();
  act(() => expect(result.current.request(['42'])).toBe(true));
  expect(result.current.failure).toBeUndefined();
  act(() => {
    result.current.request([]);
  });
  expect(change).toHaveBeenCalledExactlyOnceWith('');
});

it.each([
  () => 'invalid',
  () => ({ success: true }),
  () => Promise.resolve(true),
  () => Promise.reject(new Error('Async callback is invalid')),
  () => {
    throw new Error('Host failed');
  },
])(
  'rejects invalid decisions without publishing an optimistic value',
  async (action) => {
    const onValueChange = listboxSingleChangeSchema.parse(action);
    const { result } = renderHook(() =>
      useListboxRequest({
        label: 'Choice',
        items,
        value: '42',
        onValueChange,
      }),
    );
    await act(async () => {
      expect(result.current.request(['b'])).toBe(false);
    });
    expect(result.current.values).toEqual(['42']);
    expect(result.current.failure).toBeDefined();
  },
);

it.each([
  { disabled: true },
  { readOnly: true },
  { status: 'loading' as const },
  { status: 'error' as const },
])('blocks direct and SDK requests: %j', (protection) => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useListboxRequest({
      label: 'Choice',
      items,
      value: '42',
      onValueChange: change,
      ...protection,
    }),
  );
  act(() => expect(result.current.request(['b'])).toBe(false));
  act(() => {
    result.current.select(new Set(['b']));
  });
  act(() => expect(result.current.reset()).toBe(false));
  expect(change).not.toHaveBeenCalled();
});
