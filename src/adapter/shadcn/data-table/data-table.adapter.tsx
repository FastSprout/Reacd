import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { NativeTableView } from './native-table-view.js';
import { useNativeTable } from './use-native-table.js';

export type ShadcnDataTableProps = DataTableProps;
export function ShadcnDataTable(properties: DataTableProps) {
  const table = useNativeTable({ ...properties, manual: true });
  return (
    <NativeTableView
      table={table}
      columns={properties.columns}
      caption={properties.caption}
      state={properties.state}
      emptyMessage={properties.emptyMessage}
      errorMessage={properties.errorMessage}
      selectionEnabled={properties.onSelectionChange !== undefined}
      sortingEnabled={properties.onSortingChange !== undefined}
      filtersEnabled={properties.onFiltersChange !== undefined}
      pagingEnabled={properties.onPaginationChange !== undefined}
    />
  );
}
