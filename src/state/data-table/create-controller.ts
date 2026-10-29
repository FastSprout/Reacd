import { atom } from 'jotai/vanilla';
import type { Atom } from 'jotai/vanilla';
import { z } from 'zod';
import { DATA_TABLE_POLICY } from '../../core/data-table-policy.js';
import type { Result } from '../../core/result.js';
import { dataTableColumnsSchema } from '../../schema/data-table/columns.schema.js';
import { dataTableBindingsSchema } from '../../schema/data-table/bindings.schema.js';
import type { DataTableBindings } from '../../schema/data-table/bindings.schema.js';
import type { DataTableModel } from '../../schema/data-table/model.schema.js';
import { dataTableModelSchema } from '../../schema/data-table/model.schema.js';
import { queryTable } from '../../schema/data-table/query.js';
import { validateTableModel } from '../../schema/data-table/validate-model.js';
import type { StateRegistry, StateUpdate } from '../registry/registry.types.js';
import type { StateSnapshot } from '../../schema/state/definitions.schema.js';
import { stateFailure } from '../registry/transaction.js';
import {
  readTableModel,
  TABLE_STATE_KINDS,
  TABLE_STATE_PROPERTIES,
} from './read-model.js';
import type { DataTableController, DataTableSnapshot } from './controller.types.js';

const optionsSchema = z.strictObject({
  columns: dataTableColumnsSchema,
  bindings: dataTableBindingsSchema,
});
type ViewProperty = Exclude<keyof DataTableBindings, 'rows'>;

export function createDataTableController(
  registry: StateRegistry,
  options: unknown,
): Result<DataTableController> {
  const parsed = optionsSchema.safeParse(options);
  if (!parsed.success) return stateFailure('table', parsed.error.message);
  const { columns, bindings } = parsed.data;
  const atoms: Atom<StateSnapshot>[] = [];
  for (const property of TABLE_STATE_PROPERTIES) {
    const reference = bindings[property];
    const binding = registry.bind(reference, {
      kinds: [TABLE_STATE_KINDS[property]],
      mode: reference.mode,
    });
    if (!binding.success) return binding;
    atoms.push(binding.data.atom);
  }
  const initial = readTableModel(registry.read, columns, bindings);
  if (!initial.success) return initial;
  const snapshotAtom = atom<Result<DataTableSnapshot>>((get) => {
    for (const source of atoms) get(source);
    const model = readTableModel(registry.read, columns, bindings);
    return model.success
      ? {
          success: true,
          data: Object.freeze({
            ...model.data,
            ...queryTable(model.data),
          }),
        }
      : model;
  });
  function commit(model: DataTableModel, properties: (keyof DataTableBindings)[]) {
    const checked = validateTableModel(model);
    if (!checked.success) return checked;
    const updates: StateUpdate[] = properties.map((property) => ({
      key: bindings[property].state,
      value: checked.data[property],
    }));
    const result = registry.transaction(updates);
    return result.success ? ({ success: true, data: undefined } as const) : result;
  }
  function transition(property: ViewProperty, value: unknown): Result<void> {
    if (bindings[property].mode !== 'readWrite') {
      return stateFailure(bindings[property].state, 'This table binding is read-only.');
    }
    const current = readTableModel(registry.read, columns, bindings);
    if (!current.success) return current;
    const reset = property === 'sorting' || property === 'filters';
    const next = {
      ...current.data,
      [property]: value,
      ...(reset
        ? {
            pagination: {
              ...current.data.pagination,
              pageIndex: DATA_TABLE_POLICY.firstPageIndex,
            },
          }
        : {}),
    };
    const checked = validateTableModel(next);
    if (!checked.success) return checked;
    return commit(checked.data, reset ? [property, 'pagination'] : [property]);
  }
  const controller: DataTableController = {
    atom: snapshotAtom,
    bindings,
    read: () => registry.store.get(snapshotAtom),
    connect: () =>
      registry.constrain(
        Object.values(bindings).map((ref) => ref.state),
        (read) => {
          const result = readTableModel(read, columns, bindings);
          return result.success ? { success: true, data: undefined } : result;
        },
      ),
    select: (value) => transition('selection', value),
    sort: (value) => transition('sorting', value),
    filter: (value) => transition('filters', value),
    paginate: (value) => transition('pagination', value),
    replaceRows(value) {
      const current = readTableModel(registry.read, columns, bindings);
      if (!current.success) return current;
      const candidate = dataTableModelSchema.safeParse({
        ...current.data,
        rows: value,
      });
      if (!candidate.success)
        return stateFailure('table.rows', candidate.error.message);
      const ids = new Set(candidate.data.rows.map((row) => row.id));
      const model = {
        ...candidate.data,
        selection: candidate.data.selection.filter((id) => ids.has(id)),
      };
      const lastPage = queryTable(model).pageCount - DATA_TABLE_POLICY.pageStep;
      return commit(
        {
          ...model,
          pagination: {
            ...model.pagination,
            pageIndex: Math.min(model.pagination.pageIndex, lastPage),
          },
        },
        ['rows', 'selection', 'pagination'],
      );
    },
  };
  return { success: true, data: Object.freeze(controller) };
}
