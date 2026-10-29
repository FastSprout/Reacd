import type { Result } from '../../core/result.js';
import { dataTableModelSchema } from './model.schema.js';
import type { DataTableModel } from './model.schema.js';
import { queryTable } from './query.js';

export function validateTableModel(input: unknown): Result<DataTableModel> {
  const parsed = dataTableModelSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: ['table', ...issue.path.map(String)].join('.'),
        message: issue.message,
      })),
    };
  const model = parsed.data;
  const columns = new Map(model.columns.map((column) => [column.key, column]));
  const valid =
    model.rows.every(
      (row) =>
        Object.keys(row.cells).length === columns.size &&
        model.columns.every((column) => {
          const cell = row.cells[column.key];
          return (
            cell === null ||
            typeof cell === (column.kind === 'text' ? 'string' : column.kind)
          );
        }),
    ) &&
    model.selection.every((id) => model.rows.some((row) => row.id === id)) &&
    model.sorting.every((rule) => columns.has(rule.column)) &&
    model.filters.every((rule) => {
      const column = columns.get(rule.column);
      if (column === undefined) return false;
      if (rule.operator === 'contains') return column.kind === 'text';
      if (rule.operator !== 'equals') return column.kind === 'number';
      return (
        rule.value === null ||
        typeof rule.value === (column.kind === 'text' ? 'string' : column.kind)
      );
    }) &&
    model.pagination.pageIndex < queryTable(model).pageCount;
  return valid
    ? { success: true, data: model }
    : {
        success: false,
        issues: [
          {
            path: 'table',
            message: 'Table state violates its column or view contract.',
          },
        ],
      };
}
