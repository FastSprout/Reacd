import type { PaginationProps } from '../../../components/pagination/pagination.js';
import {
  PAGINATION_POLICY,
  PAGINATION_DEFAULTS,
} from '../../../core/pagination-policy.js';
import { paginationTokens, paginationPageCount } from '../../../core/pagination.js';
import { paginationHref } from '../../../core/pagination-href.js';
import { PaginationControl } from './pagination-control.js';

export function ShadcnPagination({
  label,
  totalItems,
  value,
  onValueChange,
  navigation,
  disabled = false,
  showControls = PAGINATION_DEFAULTS.showControls,
  showEdges = PAGINATION_DEFAULTS.showEdges,
  siblingCount = PAGINATION_DEFAULTS.siblingCount,
  size = PAGINATION_DEFAULTS.size,
}: PaginationProps) {
  const count = paginationPageCount(totalItems, value.pageSize);
  const last = count - PAGINATION_POLICY.displayOffset;
  const locked = disabled || (onValueChange === undefined && navigation === undefined);
  function control(
    index: number,
    name: string,
    content: string | number,
    isPage = false,
  ) {
    return (
      <PaginationControl
        label={name}
        pageIndex={index}
        value={value}
        onValueChange={onValueChange}
        current={isPage && index === value.pageIndex}
        disabled={
          locked ||
          index < 0 ||
          index > last ||
          totalItems === 0 ||
          (!isPage && index === value.pageIndex)
        }
        href={
          navigation === undefined
            ? undefined
            : paginationHref(navigation, {
                ...value,
                pageIndex: Math.max(0, Math.min(last, index)),
              })
        }
      >
        {content}
      </PaginationControl>
    );
  }
  return (
    <nav
      className="reacd-node reacd-pagination"
      aria-label={label}
      data-slot="pagination"
      data-size={size}
    >
      <p className="reacd-pagination-status" role="status" aria-atomic="true">
        {`Page ${value.pageIndex + 1} of ${count}. ${totalItems} items.`}
      </p>
      <ul className="reacd-pagination-list" data-slot="pagination-content">
        {showControls && (
          <>
            <li>{control(0, 'First page', 'First')}</li>
            <li>{control(value.pageIndex - 1, 'Previous page', 'Previous')}</li>
          </>
        )}
        {paginationTokens(count, value.pageIndex, siblingCount, showEdges).map(
          (token) =>
            token.type === 'page' ? (
              <li key={token.index}>
                {control(token.index, `Page ${token.index + 1}`, token.index + 1, true)}
              </li>
            ) : (
              <li
                key={`gap-${token.from}`}
                aria-hidden="true"
                className="reacd-pagination-ellipsis"
              >
                …
              </li>
            ),
        )}
        {showControls && (
          <>
            <li>{control(value.pageIndex + 1, 'Next page', 'Next')}</li>
            <li>{control(last, 'Last page', 'Last')}</li>
          </>
        )}
      </ul>
    </nav>
  );
}
