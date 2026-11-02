import type { InteractiveTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/table.props.js';
import { TABLE_EDITABLE } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import { NativeTableView } from '../data-table/native-table-view.js';
import { useNativeTable } from '../data-table/use-native-table.js';

export function ShadcnInteractiveTable({
  model,
  caption,
  onModelChange,
  editable = TABLE_EDITABLE,
  readOnly,
  disabled,
  state,
  emptyMessage,
  errorMessage,
  loadingMessage,
  onRetry,
  retryLabel,
}: InteractiveTableProps) {
  const write = onModelChange && !readOnly && !disabled ? onModelChange : undefined;
  const resetPagination = {
    ...model.pagination,
    pageIndex: DATA_TABLE_POLICY.firstPageIndex,
  };
  const table = useNativeTable({
    ...model,
    manual: false,
    onSelectionChange:
      write && editable.selection
        ? (selection) => write({ ...model, selection })
        : undefined,
    onSortingChange:
      write && editable.sorting
        ? (sorting) => write({ ...model, sorting, pagination: resetPagination })
        : undefined,
    onFiltersChange:
      write && editable.filters
        ? (filters) => write({ ...model, filters, pagination: resetPagination })
        : undefined,
    onPaginationChange:
      write && editable.pagination
        ? (pagination) => write({ ...model, pagination })
        : undefined,
  });
  return (
    <NativeTableView
      table={table}
      columns={model.columns}
      caption={caption}
      state={state}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
      loadingMessage={loadingMessage}
      onRetry={disabled ? undefined : onRetry}
      retryLabel={retryLabel}
      selectionEnabled={Boolean(write && editable.selection)}
      sortingEnabled={Boolean(write && editable.sorting)}
      filtersEnabled={Boolean(write && editable.filters)}
      pagingEnabled={Boolean(write && editable.pagination)}
    />
  );
}
