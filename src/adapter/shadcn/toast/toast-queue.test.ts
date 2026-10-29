import { renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TOAST_POLICY } from '../../../core/toast-policy.js';
import { createToastQueue } from './toast-queue.js';
import { useToastQueue } from './toast-queue-context.js';
it('reserves bounded isolated queue slots', () => {
  const first = createToastQueue();
  const second = createToastQueue();
  for (let index = 0; index < TOAST_POLICY.maximumQueued; index++)
    expect(first.reserve(`toast-${index}`)).toBe(true);
  expect(first.reserve('toast-0')).toBe(true);
  expect(first.reserve('excess')).toBe(false);
  expect(second.reserve('excess')).toBe(true);
  first.release('missing');
  first.release('toast-0');
  expect(first.reserve('excess')).toBe(true);
  expect(first.store.get(first.keys).size).toBe(TOAST_POLICY.maximumQueued);
});
it('fails explicitly outside the trusted Surface provider', () => {
  expect(() => renderHook(useToastQueue)).toThrow('Surface notification provider');
});
