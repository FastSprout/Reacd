import type { ReactNode } from 'react';
import type { PaginationProps } from
  '@fastsprout/reacd/adapter-runtime/components/pagination/pagination.props.js';
import { paginationHref } from
  '@fastsprout/reacd/adapter-runtime/core/pagination-href.js';
import { Button } from '../vendor/ui/button.js';
import { PaginationLink } from '../vendor/ui/pagination.js';
import { requestPaginationChange } from './request-change.js';

export function ShadcnPaginationTarget({
  props,
  index,
  blocked,
  label,
  children,
  isPage = false,
}: {
  readonly props: PaginationProps;
  readonly index: number;
  readonly blocked: boolean;
  readonly label: string;
  readonly children: ReactNode;
  readonly isPage?: boolean;
}) {
  const selected = index === props.value.pageIndex;
  const current = isPage && selected;
  const value = { ...props.value, pageIndex: index };
  const size =
    props.size === 'small' ? 'sm' : props.size === 'large' ? 'lg' : 'default';
  const href = props.navigation && paginationHref(props.navigation, value);
  const disabled = blocked || (!isPage && selected);
  return href ? (
    <PaginationLink
      href={disabled ? undefined : href}
      role="link"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      isActive={current}
      aria-label={label}
      size={size}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.shiftKey ||
          props.onValueChange === undefined
        )
          return;
        event.preventDefault();
        if (requestPaginationChange(props.onValueChange, value)) {
          globalThis.location.assign(href);
        }
      }}
    >
      {children}
    </PaginationLink>
  ) : (
    <Button
      type="button"
      size={size}
      variant={current ? 'outline' : 'ghost'}
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      disabled={blocked || selected}
      onClick={() => requestPaginationChange(props.onValueChange, value)}
    >
      {children}
    </Button>
  );
}
