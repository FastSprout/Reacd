import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { StrictMode } from 'react';
import { expect, it, vi } from 'vitest';
import { useReasoningDisclosure } from './use-reasoning-disclosure.js';

const defaults = {
  open: false,
  streaming: false,
  autoOpen: false,
  autoClose: false,
  disabled: false,
};

it('requests stream edge changes once and leaves rejected requests controlled', () => {
  const change = vi.fn();
  const initial = {
    ...defaults,
    streaming: true,
    autoOpen: true,
    autoClose: true,
    onOpenChange: change,
  };
  const hook = renderHook((props) => useReasoningDisclosure(props), {
    initialProps: initial,
    wrapper: StrictMode,
  });
  expect(change.mock.calls).toEqual([[true]]);
  hook.rerender({ ...initial });
  expect(change.mock.calls).toEqual([[true]]);
  act(() => hook.result.current(false));
  hook.rerender({ ...initial, streaming: false, open: true });
  expect(change.mock.calls).toEqual([[true], [false]]);
  hook.rerender({ ...initial });
  hook.rerender({ ...initial, streaming: false, open: true });
  expect(change.mock.calls).toEqual([[true], [false], [true], [false]]);
});

it('keeps automatic changes opt-in and protects disabled or unchanged streams', () => {
  const change = vi.fn();
  const initial = { ...defaults, onOpenChange: change };
  const hook = renderHook((props) => useReasoningDisclosure(props), {
    initialProps: initial,
  });
  hook.rerender({ ...initial, streaming: true });
  hook.rerender({ ...initial, streaming: false, open: true });
  hook.rerender({ ...initial, streaming: true, autoOpen: true, disabled: true });
  hook.rerender({
    ...initial,
    streaming: false,
    autoClose: true,
    open: true,
    disabled: true,
  });
  hook.rerender({ ...initial, streaming: true, open: true, autoOpen: true });
  expect(change).not.toHaveBeenCalled();
});
