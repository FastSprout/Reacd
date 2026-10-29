import { DATA_TABLE_POLICY } from '../../core/data-table-policy.js';
import type { DataTableModel } from './model.schema.js';
import { validateTableModel } from './validate-model.js';

export function validVisibleTable(
  model: DataTableModel & {
    totalRows: number;
    filteredRows: number;
    pageCount: number;
  },
): boolean {
  const { pageIndex, pageSize } = model.pagination;
  const expectedPages = Math.max(
    DATA_TABLE_POLICY.minimumPageCount,
    Math.ceil(model.filteredRows / pageSize),
  );
  const expectedRows = Math.min(
    pageSize,
    Math.max(0, model.filteredRows - pageIndex * pageSize),
  );
  return (
    model.totalRows >= model.filteredRows &&
    model.pageCount === expectedPages &&
    pageIndex < model.pageCount &&
    model.rows.length === expectedRows &&
    validateTableModel({
      columns: model.columns,
      rows: model.rows,
      selection: [],
      sorting: model.sorting,
      filters: model.filters,
      pagination: { pageIndex: DATA_TABLE_POLICY.firstPageIndex, pageSize },
    }).success
  );
}
