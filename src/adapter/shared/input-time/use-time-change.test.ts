import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { useTimeChange } from './use-time-change.js';

it('reports rejected edits, clears valid feedback and respects protection', () => {
  const change = vi.fn();
  const { result, rerender } = renderHook(
    ({ disabled, readOnly }) =>
      useTimeChange<number>((value) => value >= 0, change, 'Invalid time', {
        disabled,
        readOnly,
      }),
    { initialProps: { disabled: false, readOnly: false } },
  );
  act(() => result.current.change(-1));
  expect(result.current.error).toBe('Invalid time');
  expect(change).not.toHaveBeenCalled();
  act(() => result.current.change(1));
  expect(result.current.error).toBeUndefined();
  expect(change).toHaveBeenLastCalledWith(1);
  rerender({ disabled: true, readOnly: false });
  act(() => result.current.change(2));
  rerender({ disabled: false, readOnly: true });
  act(() => result.current.change(3));
  expect(change).toHaveBeenCalledOnce();
});
