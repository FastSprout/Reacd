import type { TableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/table.props.js';
import { queryTable } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/query.js';
import { transitionTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/table/transition.js';
import { TABLE_EDITABLE } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { MuiDataTable } from '../data-table/data-table.adapter.js';
import { MuiStaticTable } from './static-table.js';

export type MuiTableProps = TableProps;

export function MuiTable(props: MuiTableProps) {
  if (props.mode !== 'interactive') return <MuiStaticTable {...props} />;
  if (props.state === 'loading' || props.state === 'error')
    return (
      <MuiStaticTable
        caption={props.caption}
        columns={props.model.columns.map((column) => column.label)}
        rows={[]}
        state={props.state}
        errorMessage={props.errorMessage}
        loadingMessage={props.loadingMessage}
        onRetry={props.onRetry}
        retryLabel={props.retryLabel}
      />
    );
  const change = props.onModelChange;
  const editable = props.editable ?? TABLE_EDITABLE;
  const writable = !props.disabled && !props.readOnly && change !== undefined;
  return (
    <MuiDataTable
      {...props.model}
      {...queryTable(props.model)}
      caption={props.caption}
      state={props.state}
      emptyMessage={props.emptyMessage}
      errorMessage={props.errorMessage}
      onSelectionChange={
        writable && editable.selection
          ? (value) => change(transitionTableModel(props.model, 'selection', value))
          : undefined
      }
      onSortingChange={
        writable && editable.sorting
          ? (value) => change(transitionTableModel(props.model, 'sorting', value))
          : undefined
      }
      onFiltersChange={
        writable && editable.filters
          ? (value) => change(transitionTableModel(props.model, 'filters', value))
          : undefined
      }
      onPaginationChange={
        writable && editable.pagination
          ? (value) => change(transitionTableModel(props.model, 'pagination', value))
          : undefined
      }
    />
  );
}
