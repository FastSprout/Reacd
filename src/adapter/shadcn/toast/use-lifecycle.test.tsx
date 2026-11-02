import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useToastLifecycle } from './use-lifecycle.js';

it('ignores SDK callbacks after deactivation, host close and unmount', () => {
  const change = vi.fn();
  const hook = renderHook(({ open, active }) => useToastLifecycle({
    title: 'Retained capability', open, onOpenChange: change,
  }, active), { initialProps: { open: true, active: true } });
  const retained = hook.result.current;
  expect(retained.invokeAction()).toBe(false);
  hook.rerender({ open: true, active: false });
  act(() => { retained.nativeChange(); });
  expect(retained.invokeAction()).toBe(false);
  hook.rerender({ open: false, active: true });
  act(() => { retained.nativeChange(); });
  expect(retained.invokeAction()).toBe(false);
  hook.unmount();
  act(() => { retained.nativeChange(); });
  expect(retained.invokeAction()).toBe(false);
  expect(change).not.toHaveBeenCalled();
});

it('ignores prevented SDK Escape without retaining a foreign dismissal marker', () => {
  const change = vi.fn();
  const hook = renderHook(() => useToastLifecycle({
    title: 'Prevented callback', open: true, onOpenChange: change,
  }, true));
  act(() => {
    hook.result.current.nativeEscape(false, false, true);
    hook.result.current.nativeChange();
  });
  expect(change).toHaveBeenCalledExactlyOnceWith(false);
});
