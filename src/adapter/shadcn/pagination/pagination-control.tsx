import type { MouseEvent } from 'react';
import type { PaginationProps } from '../../../components/pagination/pagination.js';
import { Button } from '../vendor/ui/button.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';
interface PaginationControlProps {
  label: string;
  pageIndex: number;
  value: PaginationProps['value'];
  onValueChange: PaginationProps['onValueChange'];
  disabled: boolean;
  current?: boolean;
  href?: string | undefined;
  children: string | number;
}
export function PaginationControl({
  label,
  pageIndex,
  value,
  onValueChange,
  disabled,
  current = false,
  href,
  children,
}: PaginationControlProps) {
  function change(): boolean {
    return (
      pageIndex === value.pageIndex ||
      onValueChange?.({ ...value, pageIndex }) !== false
    );
  }
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      if (onValueChange !== undefined) {
        const target = event.currentTarget.href;
        event.preventDefault();
        if (change()) followHref(target);
        return;
      }
      change();
    }
  }
  return href === undefined ? (
    <Button
      type="button"
      variant={current ? 'default' : 'outline'}
      className="reacd-node reacd-button reacd-pagination-control"
      data-intent={current ? 'primary' : 'secondary'}
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      onClick={change}
    >
      {children}
    </Button>
  ) : (
    <a
      className="reacd-node reacd-pagination-control reacd-pagination-link"
      data-current={current}
      href={disabled ? undefined : href}
      role="link"
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={navigate}
    >
      {children}
    </a>
  );
}
