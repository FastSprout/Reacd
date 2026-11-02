import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationProps } from
  '@fastsprout/reacd/adapter-runtime/components/pagination/pagination.props.js';
import {
  PAGINATION_DEFAULTS,
  PAGINATION_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/pagination-policy.js';
import {
  paginationPageCount,
  paginationTokens,
} from '@fastsprout/reacd/adapter-runtime/core/pagination.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { FieldDescription } from '../vendor/ui/field.js';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '../vendor/ui/pagination.js';
import { ShadcnPaginationTarget } from './pagination-target.js';

export function ShadcnPagination(props: PaginationProps) {
  const field = useNativeField(props);
  const count = paginationPageCount(props.totalItems, props.value.pageSize);
  const current = props.value.pageIndex;
  const last = count - PAGINATION_POLICY.displayOffset;
  const blocked = field.blocked || (!props.navigation && !props.onValueChange);
  const edges = props.showEdges ?? PAGINATION_DEFAULTS.showEdges;
  const controls = props.showControls ?? PAGINATION_DEFAULTS.showControls;
  const tokens = paginationTokens(
    count,
    current,
    props.siblingCount ?? PAGINATION_DEFAULTS.siblingCount,
    edges,
  );
  const target = (
    index: number,
    label: string,
    children: ReactNode,
    isPage = false,
  ) => (
    <PaginationItem key={label}>
      <ShadcnPaginationTarget
        props={props}
        index={index}
        blocked={blocked || index < PAGINATION_POLICY.firstIndex || index > last}
        label={label}
        isPage={isPage}
      >
        {children}
      </ShadcnPaginationTarget>
    </PaginationItem>
  );
  return (
    <Pagination aria-label={props.label} className="flex-col items-center gap-2">
      <PaginationContent className="flex-wrap justify-center">
        {edges && target(PAGINATION_POLICY.firstIndex, 'First page', <ChevronsLeft />)}
        {controls && target(current - 1, 'Previous page', <ChevronLeft />)}
        {tokens.map((token) =>
          token.type === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${token.from}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            target(
              token.index,
              `Page ${token.index + PAGINATION_POLICY.displayOffset}`,
              token.index + PAGINATION_POLICY.displayOffset,
              true,
            )
          ),
        )}
        {controls && target(current + 1, 'Next page', <ChevronRight />)}
        {edges && target(last, 'Last page', <ChevronsRight />)}
      </PaginationContent>
      <FieldDescription role="status">
        Page {current + PAGINATION_POLICY.displayOffset} of {count} ·{' '}
        {props.totalItems} items
      </FieldDescription>
    </Pagination>
  );
}
