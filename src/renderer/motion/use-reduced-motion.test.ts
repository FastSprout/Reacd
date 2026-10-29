import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useReducedMotion } from './use-reduced-motion.js';
it('observes motion preferences and cleans up the specific subscription', () => {
  let notify: () => void = () => undefined;
  const query = {
    matches: false,
    addEventListener: vi.fn((_name: string, listener: () => void) => {
      notify = listener;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', () => query);
  const { result, unmount } = renderHook(useReducedMotion);
  expect(result.current).toBe(false);
  act(() => {
    query.matches = true;
    notify();
  });
  expect(result.current).toBe(true);
  unmount();
  expect(query.removeEventListener).toHaveBeenCalled();
  vi.unstubAllGlobals();
});
it('uses static presentation when the media-query API is unavailable', () => {
  vi.stubGlobal('matchMedia', undefined);
  const { result } = renderHook(useReducedMotion);
  expect(result.current).toBeUndefined();
  vi.unstubAllGlobals();
});
