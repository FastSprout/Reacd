import { filtersValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/filters/filters.schema.js';
import type { DataTableColumn } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/columns.schema.js';
import type { DataTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';

export function updateColumnFilter(
  filters: DataTableModel['filters'],
  column: DataTableColumn,
  text: string,
): DataTableModel['filters'] | null {
  const operator = column.kind === 'text' ? 'contains' : 'equals';
  const other = filters.filter(
    (rule) => rule.column !== column.key || rule.operator !== operator,
  );
  if (
    text === '' ||
    (column.kind === 'boolean' && text === DATA_TABLE_POLICY.allFilterValue)
  )
    return other;
  if (column.kind === 'boolean' && !['true', 'false', 'null'].includes(text))
    return null;
  const value =
    column.kind !== 'text' && text === 'null'
      ? null
      : column.kind === 'number'
        ? Number(text)
        : column.kind === 'boolean'
          ? text === 'true'
          : text;
  if (typeof value === 'number' && !Number.isFinite(value)) return null;
  const result = filtersValueSchema.safeParse([
    ...other,
    { column: column.key, operator, value },
  ]);
  return result.success ? result.data : null;
}
