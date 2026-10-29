import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useFollowLatest } from './use-follow-latest.js';

it('ignores absent viewports for initial effects and detached controls', () => {
  const { result } = renderHook(() => useFollowLatest(true, [], 'ready'));
  act(() => {
    result.current.latest();
    result.current.scroll();
  });
  expect(result.current.showLatest).toBe(false);
});
