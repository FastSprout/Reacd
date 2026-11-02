import type { PaginationProps } from
  '@fastsprout/reacd/adapter-runtime/components/pagination/pagination.props.js';

export function requestPaginationChange(
  change: ((value: PaginationProps['value']) => unknown) | undefined,
  value: PaginationProps['value'],
): boolean {
  try {
    const result: unknown = change?.(value);
    return result === undefined || result === true;
  } catch {
    return false;
  }
}
