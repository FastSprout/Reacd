import type { Result } from '../../core/result.js';
import type { DataTableBindings } from '../../schema/data-table/bindings.schema.js';
import type { DataTableColumn } from '../../schema/data-table/columns.schema.js';
import type { DataTableModel } from '../../schema/data-table/model.schema.js';
import { validateTableModel } from '../../schema/data-table/validate-model.js';
import type { StateReader } from '../registry/registry.types.js';
import { stateFailure } from '../registry/transaction.js';

export const TABLE_STATE_KINDS = {
  rows: 'tableRows',
  selection: 'selection',
  sorting: 'sorting',
  filters: 'filters',
  pagination: 'pagination',
} as const;
export const TABLE_STATE_PROPERTIES = [
  'rows',
  'selection',
  'sorting',
  'filters',
  'pagination',
] as const;

export function readTableModel(
  read: StateReader,
  columns: readonly DataTableColumn[],
  bindings: DataTableBindings,
): Result<DataTableModel> {
  const values: Record<string, unknown> = {};
  for (const property of TABLE_STATE_PROPERTIES) {
    const reference = bindings[property];
    const result = read(reference.state);
    if (!result.success) return result;
    const expected = TABLE_STATE_KINDS[property];
    if (result.data.kind !== expected) {
      return stateFailure(reference.state, 'Incompatible table state kind.');
    }
    values[property] = result.data.value;
  }
  return validateTableModel({ columns, ...values });
}
