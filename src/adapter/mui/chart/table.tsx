import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/table-policy.js';

export function ChartTable(props: ChartProps) {
  return (
    <TableContainer role="region" aria-label={`${props.label} data`}
      tabIndex={TABLE_POLICY.scrollTabIndex}>
      <Table aria-label={`${props.label} data`}>
        <Typography component="caption">{`${props.label} data`}</Typography>
        <TableHead><TableRow>
          <TableCell>{CHART_DEFAULTS.categoryLabel}</TableCell>
          {props.series.map((series) => <TableCell key={series.id}>
            {series.label}
          </TableCell>)}
        </TableRow></TableHead>
        <TableBody>{props.categories.map((category, index) =>
          <TableRow key={category.id}>
            <TableCell component="th" scope="row">{category.label}</TableCell>
            {props.series.map((series) => <TableCell key={series.id}>
              {series.values[index] ?? CHART_DEFAULTS.missingValue}
            </TableCell>)}
          </TableRow>,
        )}</TableBody>
      </Table>
    </TableContainer>
  );
}
