import { expect, it } from 'vitest';
import { requestNativePagination } from './request-change.js';
it('rejects malformed runtime navigation decisions', () => {
  const value = { pageIndex: 1, pageSize: 10 };
  expect(requestNativePagination(undefined, value)).toBe(true);
  expect(requestNativePagination(() => undefined, value)).toBe(true);
  expect(requestNativePagination(() => true, value)).toBe(true);
  expect(requestNativePagination(() => false, value)).toBe(false);
  expect(requestNativePagination(() => 'invalid', value)).toBe(false);
  expect(requestNativePagination(() => Promise.resolve(), value)).toBe(false);
  expect(
    requestNativePagination(() => {
      throw new Error('Rejected');
    }, value),
  ).toBe(false);
});
