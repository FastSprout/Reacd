import { useId } from 'react';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import { TABLE_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { useNativeField } from '../native-field.js';
import { emitNativeValue } from '../native-value.js';
import { MuiTableFilters } from './table-filters.js';

export type MuiDataTableProps = DataTableProps;

export function MuiDataTable(props: MuiDataTableProps) {
  const captionId = useId();
  const field = useNativeField({});
  const select = field.blocked ? undefined : props.onSelectionChange;
  const sort = field.blocked ? undefined : props.onSortingChange;
  const paginate = field.blocked ? undefined : props.onPaginationChange;
  if (props.state === 'loading')
    return <CircularProgress aria-label={TABLE_DEFAULTS.loadingMessage} />;
  if (props.state === 'error')
    return (
      <Alert severity="error">
        {props.errorMessage ?? TABLE_DEFAULTS.errorMessage}
      </Alert>
    );
  return (
    <Stack spacing={1}>
      <MuiTableFilters
        columns={props.columns}
        filters={props.filters}
        onFiltersChange={field.blocked ? undefined : props.onFiltersChange}
      />
      <TableContainer role="region" aria-labelledby={captionId} tabIndex={0}>
        <Table>
          <Typography component="caption" id={captionId}>{props.caption}</Typography>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    props.rows.length > 0 &&
                    props.rows.every((row) => props.selection.includes(row.id))
                  }
                  indeterminate={
                    props.rows.some((row) => props.selection.includes(row.id)) &&
                    !props.rows.every((row) => props.selection.includes(row.id))
                  }
                  disabled={!select || props.rows.length === 0}
                  slotProps={{ input: { 'aria-label': 'Select visible rows' } }}
                  onChange={
                    select
                      ? (_event, selected) =>
                          select(
                            selected
                              ? [
                                  ...new Set([
                                    ...props.selection,
                                    ...props.rows.map((row) => row.id),
                                  ]),
                                ]
                              : props.selection.filter(
                                  (id) => !props.rows.some((row) => row.id === id),
                                ),
                          )
                      : undefined
                  }
                />
              </TableCell>
              {props.columns.map((column) => {
                const current = props.sorting.find(
                  (rule) => rule.column === column.key,
                );
                return (
                  <TableCell
                    key={column.key}
                    scope="col"
                    sortDirection={
                      current
                        ? current.direction === 'ascending'
                          ? 'asc'
                          : 'desc'
                        : false
                    }
                  >
                    <TableSortLabel
                      active={Boolean(current)}
                      disabled={!sort}
                      direction={current?.direction === 'descending' ? 'desc' : 'asc'}
                      aria-label={`Sort ${column.label}`}
                      onClick={
                        sort
                          ? () => {
                              const other = props.sorting.filter(
                                (rule) => rule.column !== column.key,
                              );
                              sort(
                                current?.direction === 'descending'
                                  ? other
                                  : [
                                      ...other,
                                      {
                                        column: column.key,
                                        direction: current ? 'descending' : 'ascending',
                                      },
                                    ],
                              );
                            }
                          : undefined
                      }
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={props.columns.length + 1}>
                  {props.emptyMessage ?? TABLE_DEFAULTS.emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              props.rows.map((row) => (
                <TableRow key={row.id} selected={props.selection.includes(row.id)}>
                  <TableCell>
                    <Checkbox
                      checked={props.selection.includes(row.id)}
                      disabled={!select}
                      slotProps={{ input: { 'aria-label': `Select row ${row.id}` } }}
                      onChange={
                        select
                          ? (_event, selected) =>
                              select(
                                selected
                                  ? [...props.selection, row.id]
                                  : props.selection.filter((id) => id !== row.id),
                              )
                          : undefined
                      }
                    />
                  </TableCell>
                  {props.columns.map((column) => (
                    <TableCell key={column.key}>
                      {String(row.cells[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={props.filteredRows}
        page={props.pagination.pageIndex}
        rowsPerPage={props.pagination.pageSize}
        rowsPerPageOptions={[
          ...new Set([...DATA_TABLE_POLICY.pageSizes, props.pagination.pageSize]),
        ].sort((a, b) => a - b)}
        disabled={!paginate}
        onPageChange={(_event, pageIndex) => {
          emitNativeValue(paginate, { ...props.pagination, pageIndex }, false);
        }}
        onRowsPerPageChange={
          paginate
            ? (event) =>
                paginate({
                  pageIndex: DATA_TABLE_POLICY.firstPageIndex,
                  pageSize: Number(event.target.value),
                })
            : undefined
        }
      />
    </Stack>
  );
}
