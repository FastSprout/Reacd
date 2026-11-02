import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ProgressProps } from
  '@fastsprout/reacd/adapter-runtime/components/progress/progress.props.js';
import { PROGRESS_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';

export type MuiProgressProps = ProgressProps;

export function MuiProgress(props: MuiProgressProps) {
  const max = props.max ?? PROGRESS_POLICY.max;
  const determinate = props.value !== null && props.value !== undefined;
  const value = props.value ?? 0;
  return (
    <Stack>
      <LinearProgress
        aria-label={props.label}
        variant={determinate ? 'determinate' : 'indeterminate'}
        value={(value / max) * PROGRESS_POLICY.percentScale}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={determinate ? value : undefined}
      />
      {props.description && (
        <Typography variant="caption">{props.description}</Typography>
      )}
      {(props.showValue ?? PROGRESS_POLICY.showValue) && determinate && (
        <Typography variant="caption">{`${value} / ${max}`}</Typography>
      )}
    </Stack>
  );
}
