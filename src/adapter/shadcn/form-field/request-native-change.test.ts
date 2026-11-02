import { expect, it, vi } from 'vitest';
import { requestNativeChange } from './request-native-change.js';

it('blocks inactive SDK requests before invoking or validating host changes', () => {
  const request = vi.fn();
  requestNativeChange(true, request);
  expect(request).not.toHaveBeenCalled();
  requestNativeChange(false, request);
  expect(request).toHaveBeenCalledExactlyOnceWith();
});
