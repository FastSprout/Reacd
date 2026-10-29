import type { DataTableModel } from '../src/schema/data-table/model.schema.js';
import type { DataTableBindings } from '../src/schema/data-table/bindings.schema.js';
import type { Result } from '../src/core/result.js';
import type { StateDefinition } from '../src/schema/state/definitions.schema.js';
import { createStateRegistry } from '../src/state/registry/state-registry.js';
import * as tableState from '../src/state/data-table/create-controller.js';

export function success<Value>(result: Result<Value>): Value {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}
export const TABLE_MODEL: DataTableModel = {
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
    { key: 'active', label: 'Active', kind: 'boolean' },
  ],
  rows: [
    { id: 'a', cells: { name: 'Alpha', amount: 30, active: true } },
    { id: 'b', cells: { name: 'Beta', amount: 10, active: false } },
    { id: 'c', cells: { name: 'Gamma', amount: 20, active: true } },
  ],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 1 },
};
export const TABLE_BINDINGS: DataTableBindings = {
  rows: { state: 'orders.rows', mode: 'read' },
  selection: { state: 'orders.selection', mode: 'readWrite' },
  sorting: { state: 'orders.sorting', mode: 'readWrite' },
  filters: { state: 'orders.filters', mode: 'readWrite' },
  pagination: { state: 'orders.pagination', mode: 'readWrite' },
};
export function tableDefinitions(model = TABLE_MODEL): StateDefinition[] {
  return [
    { key: 'orders.rows', kind: 'tableRows', initial: model.rows, access: 'read' },
    {
      key: 'orders.selection',
      kind: 'selection',
      initial: model.selection,
      access: 'readWrite',
    },
    {
      key: 'orders.sorting',
      kind: 'sorting',
      initial: model.sorting,
      access: 'readWrite',
    },
    {
      key: 'orders.filters',
      kind: 'filters',
      initial: model.filters,
      access: 'readWrite',
    },
    {
      key: 'orders.pagination',
      kind: 'pagination',
      initial: model.pagination,
      access: 'readWrite',
    },
  ];
}
export function tableFixture(model = TABLE_MODEL, bindings = TABLE_BINDINGS) {
  const registry = success(createStateRegistry(tableDefinitions(model)));
  const controller = success(
    tableState.createDataTableController(registry, {
      columns: model.columns,
      bindings,
    }),
  );
  return { registry, controller };
}
