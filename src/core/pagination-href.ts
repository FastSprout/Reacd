import { PAGINATION_POLICY } from './pagination-policy.js';
export interface PaginationNavigation {
  href: string;
  pageParameter?: string | undefined;
  pageSizeParameter?: string | undefined;
}
export function paginationHref(
  navigation: PaginationNavigation,
  value: { readonly pageIndex: number; readonly pageSize: number },
): string {
  const url = new URL(navigation.href, PAGINATION_POLICY.relativeOrigin);
  url.searchParams.set(
    navigation.pageParameter ?? PAGINATION_POLICY.pageParameter,
    String(value.pageIndex + PAGINATION_POLICY.displayOffset),
  );
  url.searchParams.set(
    navigation.pageSizeParameter ?? PAGINATION_POLICY.pageSizeParameter,
    String(value.pageSize),
  );
  return navigation.href.startsWith('/')
    ? `${url.pathname}${url.search}${url.hash}`
    : url.href;
}
