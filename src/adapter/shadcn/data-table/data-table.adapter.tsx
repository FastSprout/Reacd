import type { CSSProperties } from 'react';
import type { DataTableProps } from '../../../components/data-table/data-table.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { TableColumnFilter } from './filters.adapter.js';
import { TablePagination } from './pagination.adapter.js';

export function ShadcnDataTable(props: DataTableProps) {
  const {
    caption,
    columns,
    rows,
    selection,
    sorting,
    filters,
    onSelectionChange,
    onSortingChange,
    onFiltersChange,
  } = props;
  if (props.state === 'loading') return <p role="status">Loading data…</p>;
  if (props.state === 'error')
    return <p role="alert">{props.errorMessage ?? 'Unable to load data.'}</p>;
  const variables: CSSProperties & { '--reacd-table-columns': number } = {
    '--reacd-table-columns': columns.length + 1,
  };
  return (
    <div className="reacd-vstack">
      <div
        className="reacd-table-scroll"
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="reacd-table" style={variables}>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Selection</th>
              {columns.map((column) => {
                const sort = sorting.find((rule) => rule.column === column.key);
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={sort?.direction ?? 'none'}
                  >
                    <ShadcnButton
                      label={`Sort ${column.label}`}
                      intent="secondary"
                      disabled={onSortingChange === undefined}
                      onPress={() =>
                        onSortingChange?.(
                          sort?.direction === 'descending'
                            ? []
                            : [
                                {
                                  column: column.key,
                                  direction:
                                    sort === undefined ? 'ascending' : 'descending',
                                },
                              ],
                        )
                      }
                    />
                    <TableColumnFilter
                      column={column}
                      filters={filters}
                      onFiltersChange={onFiltersChange}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <ShadcnCheckbox
                    label={`Select row ${row.id}`}
                    checked={selection.includes(row.id)}
                    disabled={onSelectionChange === undefined}
                    onCheckedChange={(checked) =>
                      onSelectionChange?.(
                        checked
                          ? [...selection, row.id]
                          : selection.filter((id) => id !== row.id),
                      )
                    }
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key}>{String(row.cells[column.key] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p role="status">{props.emptyMessage ?? 'No matching rows.'}</p>
      )}
      <TablePagination {...props} />
    </div>
  );
}
