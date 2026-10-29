import type { InteractiveTableProps } from '../../../components/table/index.js';
import { TABLE_EDITABLE } from '../../../core/table-policy.js';
import { queryTable } from '../../../schema/data-table/query.js';
import { transitionTableModel } from '../../../schema/table/transition.js';
import { ShadcnDataTable } from '../data-table/data-table.adapter.js';
type Model = InteractiveTableProps['model'];
export function ShadcnInteractiveTable({
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
    <ShadcnDataTable
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
