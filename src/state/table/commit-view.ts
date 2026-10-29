import type { Result } from '../../core/result.js';
import { TABLE_VIEW_FIELDS } from '../../core/table-policy.js';
import type { DataTableBindings } from '../../schema/data-table/bindings.schema.js';
import type { DataTableModel } from '../../schema/data-table/model.schema.js';
import { validateTableModel } from '../../schema/data-table/validate-model.js';
import type { StateRegistry, StateUpdate } from '../registry/registry.types.js';
import { stateFailure } from '../registry/transaction.js';
export function commitTableView(
  registry: StateRegistry,
  bindings: DataTableBindings,
  current: DataTableModel,
  input: unknown,
): Result<void> {
  const result = validateTableModel(input);
  if (!result.success) return result;
  const next = result.data;
  if (
    JSON.stringify(current.columns) !== JSON.stringify(next.columns) ||
    JSON.stringify(current.rows) !== JSON.stringify(next.rows)
  )
    return stateFailure('table', 'Table view cannot replace its source dataset.');
  const updates: StateUpdate[] = [];
  for (const property of TABLE_VIEW_FIELDS) {
    if (JSON.stringify(current[property]) === JSON.stringify(next[property])) continue;
    const reference = bindings[property];
    if (reference.mode !== 'readWrite')
      return stateFailure(reference.state, 'This table binding is read-only.');
    updates.push({ key: reference.state, value: next[property] });
  }
  const committed = registry.transaction(updates);
  return committed.success ? { success: true, data: undefined } : committed;
}
