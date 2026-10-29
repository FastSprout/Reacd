import type { Result } from '../../core/result.js';
import type { DataTableBindings } from './bindings.schema.js';
import type { DataTableColumn } from './columns.schema.js';
import type { StateDefinition } from '../state/definitions.schema.js';
import { validateTableModel } from './validate-model.js';

export function validateInitialTable(
  columns: readonly DataTableColumn[],
  bindings: DataTableBindings,
  definitions: ReadonlyMap<string, StateDefinition>,
): Result<void> {
  const values = Object.fromEntries(
    Object.entries(bindings).map(([name, ref]) => [
      name,
      definitions.get(ref.state)?.initial,
    ]),
  );
  const result = validateTableModel({ columns, ...values });
  return result.success ? { success: true, data: undefined } : result;
}
