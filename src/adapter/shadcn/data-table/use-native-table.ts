import { useMemo } from 'react';
import { functionalUpdate, sortFn_basic, useTable } from '@tanstack/react-table';
import type { ColumnFiltersState, RowSelectionState } from '@tanstack/react-table';
import type {
  DataTableModel,
  TableRow,
} from '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { filtersValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/filters/filters.schema.js';
import { sortingValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/sorting/sorting.schema.js';
import { selectionValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/selection/selection.schema.js';
import { paginationValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/pagination/pagination.schema.js';
import { canonicalFilter, columnHelper, TABLE_FEATURES } from './sdk-table.js';

export interface NativeTableInput extends DataTableModel {
  readonly manual: boolean;
  readonly pageCount?: number | undefined;
  readonly onSelectionChange?: DataTableProps['onSelectionChange'];
  readonly onSortingChange?: DataTableProps['onSortingChange'];
  readonly onFiltersChange?: DataTableProps['onFiltersChange'];
  readonly onPaginationChange?: DataTableProps['onPaginationChange'];
}
const rowId = (row: TableRow) => row.id;
export function useNativeTable(input: NativeTableInput) {
  const columns = useMemo(
    () =>
      input.columns.map((column) =>
        columnHelper.accessor((row): unknown => row.cells[column.key] ?? undefined, {
          id: column.key,
          header: column.label,
          filterFn: canonicalFilter,
          sortFn: sortFn_basic,
          sortUndefined: 'last',
          meta: column,
        }),
      ),
    [input.columns],
  );
  const sorting = useMemo(
    () =>
      input.sorting.map((rule) => ({
        id: rule.column,
        desc: rule.direction === 'descending',
      })),
    [input.sorting],
  );
  const selection: RowSelectionState = useMemo(
    () => Object.fromEntries(input.selection.map((id) => [id, true] as const)),
    [input.selection],
  );
  const filters: ColumnFiltersState = useMemo(
    () =>
      [...new Set(input.filters.map((rule) => rule.column))].map((id) => ({
        id,
        value: input.filters.filter((rule) => rule.column === id),
      })),
    [input.filters],
  );
  return useTable({
    features: TABLE_FEATURES,
    columns,
    data: input.rows,
    getRowId: rowId,
    state: {
      sorting,
      rowSelection: selection,
      columnFilters: filters,
      pagination: input.pagination,
    },
    manualSorting: input.manual,
    manualFiltering: input.manual,
    manualPagination: input.manual,
    ...(input.pageCount === undefined ? {} : { pageCount: input.pageCount }),
    autoResetPageIndex: false,
    enableRowSelection: input.onSelectionChange !== undefined,
    onRowSelectionChange: (update) =>
      input.onSelectionChange?.(
        selectionValueSchema.parse(Object.keys(functionalUpdate(update, selection))),
      ),
    onSortingChange: (update) =>
      input.onSortingChange?.(
        sortingValueSchema.parse(
          functionalUpdate(update, sorting).map((rule) => ({
            column: rule.id,
            direction: rule.desc ? 'descending' : 'ascending',
          })),
        ),
      ),
    onColumnFiltersChange: (update) =>
      input.onFiltersChange?.(
        filtersValueSchema.parse(
          functionalUpdate(update, filters).flatMap((filter) =>
            filtersValueSchema.parse(filter.value),
          ),
        ),
      ),
    onPaginationChange: (update) =>
      input.onPaginationChange?.(
        paginationValueSchema.parse(functionalUpdate(update, input.pagination)),
      ),
  });
}
