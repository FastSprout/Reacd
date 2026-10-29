import { PAGINATION_POLICY } from './pagination-policy.js';
export type PaginationToken =
  { type: 'page'; index: number } | { type: 'ellipsis'; from: number; to: number };
export function paginationPageCount(totalItems: number, pageSize: number): number {
  return Math.max(PAGINATION_POLICY.minimumPages, Math.ceil(totalItems / pageSize));
}
export function paginationTokens(
  count: number,
  current: number,
  siblings: number,
  edges: boolean,
): PaginationToken[] {
  const last = count - PAGINATION_POLICY.displayOffset;
  const start = Math.max(PAGINATION_POLICY.firstIndex, current - siblings);
  const end = Math.min(last, current + siblings);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  if (edges) pages.push(PAGINATION_POLICY.firstIndex, last);
  const sorted = [...new Set(pages)].sort((left, right) => left - right);
  const result: PaginationToken[] = [];
  let previous: number | undefined;
  for (const index of sorted) {
    if (previous !== undefined && index - previous > 1) {
      if (index - previous === 2) result.push({ type: 'page', index: previous + 1 });
      else result.push({ type: 'ellipsis', from: previous + 1, to: index - 1 });
    }
    result.push({ type: 'page', index });
    previous = index;
  }
  return result;
}
