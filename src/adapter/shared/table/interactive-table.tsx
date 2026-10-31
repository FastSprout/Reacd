import type { InteractiveTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/index.js';
import { TABLE_EDITABLE } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { queryTable } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/query.js';
import { transitionTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/table/transition.js';
import { SharedDataTable } from '../data-table/data-table.adapter.js';
type Model = InteractiveTableProps['model'];
export function SharedInteractiveTable({
  caption,
  model,
  onModelChange,
  editable = TABLE_EDITABLE,
  readOnly,
  disabled,
  state,
  emptyMessage,
  errorMessage,
}: InteractiveTableProps) {
  const capabilities =
    onModelChange === undefined || readOnly || disabled
      ? {}
      : {
          onSelectionChange: editable.selection
            ? (value: Model['selection']) =>
                onModelChange(transitionTableModel(model, 'selection', value))
            : undefined,
          onSortingChange: editable.sorting
            ? (value: Model['sorting']) =>
                onModelChange(transitionTableModel(model, 'sorting', value))
            : undefined,
          onFiltersChange: editable.filters
            ? (value: Model['filters']) =>
                onModelChange(transitionTableModel(model, 'filters', value))
            : undefined,
          onPaginationChange: editable.pagination
            ? (value: Model['pagination']) =>
                onModelChange(transitionTableModel(model, 'pagination', value))
            : undefined,
        };
  return (
    <SharedDataTable
      {...model}
      {...queryTable(model)}
      {...capabilities}
      caption={caption}
      state={state}
      emptyMessage={emptyMessage}
      errorMessage={errorMessage}
    />
  );
}
