import type { z } from 'zod';
import { PAGINATION_POLICY } from '../../core/pagination-policy.js';
import { paginationPageCount, paginationTokens } from '../../core/pagination.js';
import { paginationHref } from '../../core/pagination-href.js';
import type { PaginationNavigation } from '../../core/pagination-href.js';
import { paginationValueSchema } from '../state/pagination/pagination.schema.js';
import { linkSchema } from '../link/link.schema.js';
import { paginationNavigationSchema } from './navigation.schema.js';

export function validPaginationValue(
  totalItems: number,
  value: z.infer<typeof paginationValueSchema>,
  navigation?: PaginationNavigation,
): boolean {
  const count = paginationPageCount(totalItems, value.pageSize);
  if (value.pageIndex < PAGINATION_POLICY.firstIndex || value.pageIndex >= count)
    return false;
  if (navigation === undefined) return true;
  if (!paginationNavigationSchema.safeParse(navigation).success) return false;
  const last = count - PAGINATION_POLICY.displayOffset;
  const candidates = [
    0,
    last,
    Math.max(0, value.pageIndex - 1),
    Math.min(last, value.pageIndex + 1),
    ...paginationTokens(
      count,
      value.pageIndex,
      PAGINATION_POLICY.maximumSiblings,
      true,
    ).flatMap((token) => (token.type === 'page' ? [token.index] : [])),
  ];
  return candidates.every(
    (pageIndex) =>
      linkSchema.shape.href.safeParse(
        paginationHref(navigation, { pageIndex, pageSize: value.pageSize }),
      ).success,
  );
}
export function paginationBoundValueSchema(
  totalItems: number,
  navigation?: PaginationNavigation,
) {
  return paginationValueSchema.refine(
    (value) => validPaginationValue(totalItems, value, navigation),
    'Page or navigation target is invalid.',
  );
}
