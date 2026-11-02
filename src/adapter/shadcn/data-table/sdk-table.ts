import {
  columnFilteringFeature,
  createColumnHelper,
  constructFilterFn,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_greaterThan,
  filterFn_includesString,
  filterFn_lessThan,
  filterFn_notEmpty,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  metaHelper,
} from '@tanstack/react-table';
import type { FilterFn, ReactTable } from '@tanstack/react-table';
import type { TableRow } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { filtersValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/filters/filters.schema.js';

import type { DataTableColumn } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/columns.schema.js';

export const TABLE_FEATURES = tableFeatures({
  columnMeta: metaHelper<DataTableColumn>(),
  columnFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});
export type NativeTable = ReactTable<typeof TABLE_FEATURES, TableRow>;
export const columnHelper = createColumnHelper<typeof TABLE_FEATURES, TableRow>();
const filterFunctions = {
  equals: constructFilterFn({
    ...filterFn_equals,
    resolveFilterValue: (value: unknown) => value ?? undefined,
  }),
  contains: filterFn_includesString,
  greaterThan: filterFn_greaterThan,
  lessThan: filterFn_lessThan,
};
export const canonicalFilter: FilterFn<typeof TABLE_FEATURES, TableRow> = (
  row,
  key,
  value: unknown,
) =>
  filtersValueSchema.parse(value).every((rule) => {
    const filter = filterFunctions[rule.operator];
    const resolved: unknown = filter.resolveFilterValue
      ? filter.resolveFilterValue(rule.value)
      : rule.value;
    const numeric = rule.operator === 'greaterThan' || rule.operator === 'lessThan';
    return (
      (!numeric || filterFn_notEmpty(row, key, true)) && filter(row, key, resolved)
    );
  });
