import type { CSSProperties } from 'react';
import type { StaticTableProps } from '../../components/table/index.js';

export function TableSurface({
  caption,
  columns,
  rows,
  state,
  emptyMessage,
  errorMessage,
}: StaticTableProps) {
  if (state === 'loading') return <p role="status">Loading data…</p>;
  if (state === 'error') {
    return <p role="alert">{errorMessage ?? 'Unable to load data.'}</p>;
  }
  if (rows.length === 0) {
    return <p role="status">{emptyMessage ?? 'No data available.'}</p>;
  }
  const variables: CSSProperties & { '--reacd-table-columns': number } = {
    '--reacd-table-columns': columns.length,
  };
  return (
    <div className="reacd-table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="reacd-table" style={variables}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th scope="col" key={index}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
