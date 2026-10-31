import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import { SharedButton } from '../button/button.adapter.js';
import { SharedSelect } from '../select/select.adapter.js';

export function TablePagination({
  pagination,
  pageCount,
  totalRows,
  filteredRows,
  onPaginationChange,
}: DataTableProps) {
  const { pageIndex, pageSize } = pagination;
  const sizes = [...new Set([...DATA_TABLE_POLICY.pageSizes, pageSize])].sort(
    (left, right) => left - right,
  );
  const disabled = onPaginationChange === undefined;
  const pageLabel = `Page ${pageIndex + DATA_TABLE_POLICY.pageStep} of ${pageCount}.`;
  const rowLabel = `${filteredRows} of ${totalRows} rows.`;
  return (
    <div className="reacd-hstack" aria-label="Table pagination">
      <p role="status">
        {pageLabel} {rowLabel}
      </p>
      <SharedButton
        label="Previous page"
        intent="secondary"
        disabled={disabled || pageIndex === DATA_TABLE_POLICY.firstPageIndex}
        onPress={() =>
          onPaginationChange?.({
            ...pagination,
            pageIndex: pageIndex - DATA_TABLE_POLICY.pageStep,
          })
        }
      />
      <SharedButton
        label="Next page"
        intent="secondary"
        disabled={disabled || pageIndex + DATA_TABLE_POLICY.pageStep >= pageCount}
        onPress={() =>
          onPaginationChange?.({
            ...pagination,
            pageIndex: pageIndex + DATA_TABLE_POLICY.pageStep,
          })
        }
      />
      <SharedSelect
        label="Rows per page"
        value={String(pageSize)}
        disabled={disabled}
        items={sizes.map((size) => ({ value: String(size), label: String(size) }))}
        onValueChange={(value) =>
          onPaginationChange?.({
            pageSize: Number(value),
            pageIndex: DATA_TABLE_POLICY.firstPageIndex,
          })
        }
      />
    </div>
  );
}
