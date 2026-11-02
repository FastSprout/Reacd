import { expect, it } from 'vitest';
import { requestPaginationChange } from './request-change.js';

it('accepts only a synchronous boolean or void request result', () => {
  const value = { pageIndex: 1, pageSize: 10 };
  expect(requestPaginationChange(undefined, value)).toBe(true);
  expect(requestPaginationChange(() => undefined, value)).toBe(true);
  expect(requestPaginationChange(() => true, value)).toBe(true);
  expect(requestPaginationChange(() => false, value)).toBe(false);
  expect(requestPaginationChange(() => 'invalid', value)).toBe(false);
  expect(
    requestPaginationChange(() => {
      throw new Error('Veto');
    }, value),
  ).toBe(false);
});
