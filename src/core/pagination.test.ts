import { describe, expect, it } from 'vitest';
import { paginationTokens, paginationPageCount } from './pagination.js';
import { paginationHref } from './pagination-href.js';

describe('bounded pagination model', () => {
  it('uses an empty page and a bounded window even for huge datasets', () => {
    expect(paginationPageCount(0, 10)).toBe(1);
    expect(paginationPageCount(21, 10)).toBe(3);
    const tokens = paginationTokens(1_000_000, 500_000, 2, true);
    expect(tokens).toHaveLength(9);
    expect(tokens[0]).toEqual({ type: 'page', index: 0 });
    expect(tokens.at(-1)).toEqual({ type: 'page', index: 999_999 });
  });
  it('renders single missing pages directly and supports edge-free windows', () => {
    expect(paginationTokens(5, 2, 0, true)).toEqual([
      { type: 'page', index: 0 },
      { type: 'page', index: 1 },
      { type: 'page', index: 2 },
      { type: 'page', index: 3 },
      { type: 'page', index: 4 },
    ]);
    expect(paginationTokens(9, 4, 1, false)).toEqual([
      { type: 'page', index: 3 },
      { type: 'page', index: 4 },
      { type: 'page', index: 5 },
    ]);
    expect(paginationTokens(1, 0, 2, true)).toEqual([{ type: 'page', index: 0 }]);
  });
  it('preserves URL context while encoding one-based paging parameters', () => {
    expect(
      paginationHref(
        { href: '/orders?status=open#results' },
        { pageIndex: 1, pageSize: 25 },
      ),
    ).toBe('/orders?status=open&page=2&pageSize=25#results');
    expect(
      paginationHref(
        {
          href: 'https://example.test/orders?page=9',
          pageParameter: 'p',
          pageSizeParameter: 'limit',
        },
        { pageIndex: 0, pageSize: 10 },
      ),
    ).toBe('https://example.test/orders?page=9&p=1&limit=10');
  });
});
