import type { TableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/table.props.js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../vendor/ui/table.js';
import {
  TABLE_DEFAULTS,
  TABLE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { Button } from '../vendor/ui/button.js';
import { FieldDescription } from '../vendor/ui/field.js';
import { ShadcnInteractiveTable } from './interactive-table.js';

export type ShadcnTableProps = TableProps;
export function ShadcnTable(properties: TableProps) {
  if (properties.mode === 'interactive')
    return <ShadcnInteractiveTable {...properties} />;
  const {
    caption,
    columns,
    rows,
    state,
    loadingMessage = TABLE_DEFAULTS.loadingMessage,
    emptyMessage = TABLE_DEFAULTS.emptyMessage,
    errorMessage = TABLE_DEFAULTS.errorMessage,
    onRetry,
    retryLabel = TABLE_DEFAULTS.retryLabel,
  } = properties;
  const feedback =
    state === 'loading'
      ? loadingMessage
      : state === 'error'
        ? errorMessage
        : emptyMessage;
  return (
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
        <TableRow>
          {columns.map((column, index) => (
            <TableHead scope="col" key={index}>
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {state === 'loading' || state === 'error' || rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <FieldDescription role={state === 'error' ? 'alert' : 'status'}>
                {feedback}
              </FieldDescription>
              {state === 'error' && onRetry && (
                <Button type="button" variant="outline" onClick={() => onRetry()}>
                  {retryLabel}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, column) => (
                <TableCell key={column}>{cell}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
