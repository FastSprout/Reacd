import { DATA_TABLE_POLICY } from '../../core/data-table-policy.js';
import type { DataTableModel } from '../data-table/model.schema.js';
type EditableField = 'selection' | 'sorting' | 'filters' | 'pagination';
export function transitionTableModel<Key extends EditableField>(
  model: DataTableModel,
  key: Key,
  value: DataTableModel[Key],
): DataTableModel {
  return {
    ...model,
    [key]: value,
    ...(key === 'sorting' || key === 'filters'
      ? {
          pagination: {
            ...model.pagination,
            pageIndex: DATA_TABLE_POLICY.firstPageIndex,
          },
        }
      : {}),
  };
}
