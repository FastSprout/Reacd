import { useDirection } from '@radix-ui/react-direction';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import {
  TABLE_DEFAULTS,
  TABLE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../vendor/ui/table.js';
import { Button } from '../vendor/ui/button.js';
import { Checkbox } from '../vendor/ui/checkbox.js';
import { FieldDescription } from '../vendor/ui/field.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../vendor/ui/select.js';
import type { NativeTable } from './sdk-table.js';
import { NativeFilters } from './filters.adapter.js';

interface Properties {
  readonly table: NativeTable;
  readonly columns: DataTableProps['columns'];
  readonly caption: string;
  readonly emptyMessage?: string | undefined;
  readonly errorMessage?: string | undefined;
  readonly loadingMessage?: string | undefined;
  readonly state?: DataTableProps['state'];
  readonly retryLabel?: string | undefined;
  readonly onRetry?: (() => void) | undefined;
  readonly selectionEnabled: boolean;
  readonly sortingEnabled: boolean;
  readonly filtersEnabled: boolean;
  readonly pagingEnabled: boolean;
}
const sortLabels = { asc: 'ascending', desc: 'descending' } as const;
export function NativeTableView({
  table,
  columns,
  caption,
  emptyMessage,
  state,
  errorMessage,
  loadingMessage,
  selectionEnabled,
  sortingEnabled,
  filtersEnabled,
  pagingEnabled,
  onRetry,
  retryLabel = TABLE_DEFAULTS.retryLabel,
}: Properties) {
  const rows = table.getRowModel().rows;
  const theme = useShadcnTheme();
  const direction = useDirection();
  const interactive = useInteractionState().interactive;
  const active = interactive && state !== 'loading' && state !== 'error';
  const pagingPopup = useNativePopup(pagingEnabled && active);
  const pageSizes = [
    ...new Set([table.state.pagination.pageSize, ...DATA_TABLE_POLICY.pageSizes]),
  ];
  const message =
    state === 'loading'
      ? (loadingMessage ?? TABLE_DEFAULTS.loadingMessage)
      : state === 'error'
        ? (errorMessage ?? TABLE_DEFAULTS.errorMessage)
        : (emptyMessage ?? TABLE_DEFAULTS.emptyMessage);
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
      <NativeFilters table={table} disabled={!filtersEnabled || !active} />
      <Table
        containerProps={{
          role: 'region',
          'aria-label': caption,
          tabIndex: TABLE_POLICY.scrollTabIndex,
        }}
        aria-busy={state === 'loading'}
      >
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              <TableHead scope="col">
                <Checkbox
                  aria-label="Select all visible rows"
                  disabled={!selectionEnabled || !active}
                  checked={
                    table.getIsAllPageRowsSelected()
                      ? true
                      : table.getIsSomePageRowsSelected()
                        ? 'indeterminate'
                        : false
                  }
                  onCheckedChange={(next) =>
                    table.toggleAllPageRowsSelected(next === true)
                  }
                />
              </TableHead>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    scope="col"
                    key={header.id}
                    aria-sort={sorted ? sortLabels[sorted] : 'none'}
                  >
                    <Button
                      variant="ghost"
                      type="button"
                      disabled={!sortingEnabled || !active}
                      aria-label={`Sort ${String(header.column.columnDef.header)}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                    </Button>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {state === 'loading' || state === 'error' || rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <FieldDescription
                  role={
                    state === 'error'
                      ? 'alert'
                      : state === 'loading'
                        ? 'status'
                        : undefined
                  }
                >
                  {message}
                </FieldDescription>
                {state === 'error' && onRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!interactive}
                    onClick={() => onRetry()}
                  >
                    {retryLabel}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select row ${row.id}`}
                    disabled={!selectionEnabled || !active}
                    checked={row.getIsSelected()}
                    onCheckedChange={(next) => row.toggleSelected(next === true)}
                  />
                </TableCell>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={!pagingEnabled || !active || !table.getCanPreviousPage()}
          className={[
            'h-auto min-h-9 min-w-0 max-w-full whitespace-normal',
            '[overflow-wrap:anywhere]',
          ].join(' ')}
          onClick={() => table.previousPage()}
        >
          Previous page
        </Button>
        <FieldDescription
          className="min-w-0 max-w-full [overflow-wrap:anywhere]"
          role={state === 'loading' || state === 'error' ? undefined : 'status'}
        >
          {`Page ${table.state.pagination.pageIndex + 1} of ${Math.max(
            DATA_TABLE_POLICY.minimumPageCount,
            table.getPageCount(),
          )}`}
        </FieldDescription>
        <Button
          variant="outline"
          type="button"
          disabled={!pagingEnabled || !active || !table.getCanNextPage()}
          className={[
            'h-auto min-h-9 min-w-0 max-w-full whitespace-normal',
            '[overflow-wrap:anywhere]',
          ].join(' ')}
          onClick={() => table.nextPage()}
        >
          Next page
        </Button>
        <Select
          open={pagingPopup.open}
          onOpenChange={pagingPopup.onOpenChange}
          value={String(table.state.pagination.pageSize)}
          disabled={!pagingEnabled || !active}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            aria-label="Rows per page"
            container={pagingPopup.host}
            className="motion-reduce:animate-none"
            style={theme}
            dir={direction}
          >
            {pageSizes.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
