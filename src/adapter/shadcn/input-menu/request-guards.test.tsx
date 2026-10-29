import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useInputMenu } from './use-input-menu.js';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';

const properties = {
  label: 'Guarded suggestions',
  value: '',
  onValueChange: () => undefined,
  items: [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Blocked', disabled: true },
  ],
};

it('guards stale vendor requests after status, membership and access change', () => {
  const change = vi.fn();
  const { result, rerender } = renderHook((props) => useInputMenu(props), {
    initialProps: {
      ...properties,
      onValueChange: change,
      disabled: false,
      readOnly: false,
      status: 'ready' as 'ready' | 'loading',
    },
  });
  act(() => {
    expect(result.current.requestOpen(false)).toBe(true);
    expect(result.current.requestText('Unknown', 'missing')).toBe(false);
    expect(result.current.requestText('Blocked', 'b')).toBe(false);
  });
  rerender({
    ...properties,
    onValueChange: change,
    disabled: false,
    readOnly: false,
    status: 'loading',
  });
  act(() => {
    expect(result.current.requestText('Alpha', 'a')).toBe(false);
  });
  rerender({
    ...properties,
    onValueChange: change,
    disabled: false,
    readOnly: true,
    status: 'ready',
  });
  act(() => {
    expect(result.current.requestText('Other')).toBe(false);
  });
  rerender({
    ...properties,
    onValueChange: change,
    disabled: true,
    readOnly: false,
    status: 'ready',
  });
  act(() => {
    expect(result.current.requestOpen(true)).toBe(false);
    expect(result.current.requestText('Other')).toBe(false);
  });
  expect(change).not.toHaveBeenCalled();
});

it('registers a scoped Escape dismissal without changing the text channel', () => {
  const scope = createEscapeScope();
  const disclosure = vi.fn();
  renderHook(
    () => useInputMenu({ ...properties, open: true, onOpenChange: disclosure }),
    {
      wrapper: ({ children }) => (
        <EscapeScopeContext.Provider value={scope}>
          {children}
        </EscapeScopeContext.Provider>
      ),
    },
  );
  act(() => {
    expect(scope.dismiss()).toBe(true);
  });
  expect(disclosure).toHaveBeenCalledExactlyOnceWith(false);
});

it('rejects malformed vendor text before emitting a host request', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useInputMenu({
      ...properties,
      onValueChange: change,
    }),
  );
  act(() => {
    expect(result.current.requestText('First\r\nSecond')).toBe(false);
  });
  expect(change).not.toHaveBeenCalled();
  expect(result.current.error).toContain('line breaks');
});
