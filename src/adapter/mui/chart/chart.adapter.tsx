import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useId } from 'react';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_DEFAULTS, CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { MuiButton } from '../button/button.adapter.js';
import { ChartPlot } from './plot.js';
import { ChartTable } from './table.js';

export function MuiChart(props: ChartProps) {
  const descriptionId = useId();
  if (props.state === 'loading')
    return <Typography role="status">
      {props.loadingMessage ?? CHART_DEFAULTS.loadingMessage}
    </Typography>;
  if (props.state === 'error') return (
    <Alert severity="error" action={props.onRetry && <MuiButton
      label={props.retryLabel ?? CHART_DEFAULTS.retryLabel} onPress={props.onRetry} />}>
      {props.errorMessage ?? CHART_DEFAULTS.errorMessage}
    </Alert>
  );
  const empty = props.categories.length === 0 || props.series.length === 0;
  const zeroShares = props.kind === 'donut' &&
    !props.series.some((series) => series.values.some((value) =>
      value !== null && value > CHART_POLICY.zero));
  const emptyMessage = props.emptyMessage ?? CHART_DEFAULTS.emptyMessage;
  return (
    <Box role="group" aria-label={props.label} aria-describedby={descriptionId}
      sx={{ width: '100%', maxWidth: CHART_POLICY.width, minWidth: 0 }}>
      <Typography id={descriptionId}>{props.description}</Typography>
      {empty ? <Typography role="status">{emptyMessage}</Typography> :
        zeroShares ? <Box role="img" aria-label={props.label}>
          <Typography>{emptyMessage}</Typography>
        </Box> : <ChartPlot {...props} />}
      <ChartTable {...props} />
    </Box>
  );
}
