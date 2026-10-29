import { DATA_TABLE_POLICY } from '../../core/data-table-policy.js';
import type { DataTableModel, TableCell, TableRow } from './model.schema.js';

function matches(row: TableRow, rule: DataTableModel['filters'][number]): boolean {
  const cell = row.cells[rule.column];
  switch (rule.operator) {
    case 'equals':
      return cell === rule.value;
    case 'contains':
      return (
        typeof cell === 'string' &&
        cell.toLowerCase().includes(String(rule.value).toLowerCase())
      );
    case 'greaterThan':
      return (
        typeof cell === 'number' && typeof rule.value === 'number' && cell > rule.value
      );
    case 'lessThan':
      return (
        typeof cell === 'number' && typeof rule.value === 'number' && cell < rule.value
      );
  }
}

function compare(left: TableCell, right: TableCell): number {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left < right ? -1 : 1;
}

export function queryTable(model: DataTableModel) {
  const filtered = model.rows.filter((row) =>
    model.filters.every((rule) => matches(row, rule)),
  );
  const sorted = filtered.sort((left, right) => {
    for (const rule of model.sorting) {
      const a = left.cells[rule.column] ?? null;
      const b = right.cells[rule.column] ?? null;
      const direction = rule.direction === 'ascending' ? 1 : -1;
      const order =
        a === null || b === null ? compare(a, b) : compare(a, b) * direction;
      if (order !== 0) return order;
    }
    return 0;
  });
  const { pageIndex, pageSize } = model.pagination;
  const pageCount = Math.max(
    DATA_TABLE_POLICY.minimumPageCount,
    Math.ceil(sorted.length / pageSize),
  );
  return Object.freeze({
    rows: Object.freeze(sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)),
    totalRows: model.rows.length,
    filteredRows: filtered.length,
    pageCount,
  });
}
