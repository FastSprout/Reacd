import type { Atom } from 'jotai/vanilla';
import type { Result } from '../../core/result.js';
import type { DataTableBindings } from '../../schema/data-table/bindings.schema.js';
import type { DataTableModel } from '../../schema/data-table/model.schema.js';
import type { queryTable } from '../../schema/data-table/query.js';

export type DataTableSnapshot = Readonly<
  DataTableModel & ReturnType<typeof queryTable>
>;
export interface DataTableController {
  readonly atom: Atom<Result<DataTableSnapshot>>;
  readonly bindings: DataTableBindings;
  read: () => Result<DataTableSnapshot>;
  connect: () => Result<() => void>;
  select: (value: DataTableModel['selection']) => Result<void>;
  sort: (value: DataTableModel['sorting']) => Result<void>;
  filter: (value: DataTableModel['filters']) => Result<void>;
  paginate: (value: DataTableModel['pagination']) => Result<void>;
  replaceRows: (value: DataTableModel['rows']) => Result<void>;
}
