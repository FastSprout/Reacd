import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { StaticTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/table.props.js';
import { TABLE_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/table-policy.js';

import { useNativeField } from '../native-field.js';

export function MuiStaticTable(props: StaticTableProps) {
  const field = useNativeField({});
  const retry = props.onRetry;
  if (props.state === 'loading')
    return (
      <CircularProgress
        aria-label={props.loadingMessage ?? TABLE_DEFAULTS.loadingMessage}
      />
    );
  if (props.state === 'error')
    return (
      <Alert severity="error">
        {props.errorMessage ?? TABLE_DEFAULTS.errorMessage}
        {retry && (
          <Button disabled={field.blocked} onClick={() => retry()}>
            {props.retryLabel ?? TABLE_DEFAULTS.retryLabel}
          </Button>
        )}
      </Alert>
    );
  return (
    <TableContainer>
      <Table>
        <Typography component="caption">{props.caption}</Typography>
        <TableHead>
          <TableRow>
            {props.columns.map((column, index) => (
              <TableCell key={index} scope="col">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={props.columns.length}>
                {props.emptyMessage ?? TABLE_DEFAULTS.emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            props.rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
