import { describe, expect, it } from 'vitest';
import { paginationSchema } from './pagination.schema.js';
const base = { label: 'Orders', totalItems: 21, value: { pageIndex: 0, pageSize: 10 } };
describe('Pagination contract', () => {
  it('accepts controlled, read-only and safe URL configurations', () => {
    for (const change of [
      {},
      { onValueChange: () => undefined },
      { navigation: { href: '/orders?status=open' } },
      { siblingCount: 0 },
      { totalItems: 0 },
      { showControls: false, showEdges: false, size: 'large' },
    ])
      expect(paginationSchema.safeParse({ ...base, ...change }).success).toBe(true);
  });
  it('rejects invalid pages, unsafe links and native property escapes', () => {
    for (const change of [
      { value: { pageIndex: 3, pageSize: 10 } },
      { value: { pageIndex: -1, pageSize: 10 } },
      { value: { pageIndex: 0, pageSize: 0 } },
      { totalItems: -1 },
      { totalItems: Infinity },
      { siblingCount: 3 },
      { label: ' ' },
      { navigation: { href: 'javascript:alert(1)' } },
      { navigation: { href: '#results' } },
      { navigation: { href: '/' + 'é'.repeat(700) } },
      { navigation: { href: '/orders', pageParameter: 'pageSize' } },
      { navigation: { href: '/orders', pageSizeParameter: 'page' } },
      { navigation: { href: '/orders', pageParameter: 'bad key' } },
      { onValueChange: 'callback' },
      { className: 'custom' },
      { style: {} },
    ])
      expect(paginationSchema.safeParse({ ...base, ...change }).success).toBe(false);
  });
});
