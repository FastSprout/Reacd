import type { PaginationProps } from
  '@fastsprout/reacd/adapter-runtime/components/pagination/pagination.props.js';

type Value = PaginationProps['value'];

export function requestNativePagination(
  change: ((value: Value) => unknown) | undefined,
  value: Value,
): boolean {
  try {
    const result: unknown = change?.(value);
    return result === undefined || result === true;
  } catch {
    return false;
  }
}
