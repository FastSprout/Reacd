import CircularProgress from '@mui/material/CircularProgress';
import type { SpinnerProps } from
  '@fastsprout/reacd/adapter-runtime/components/spinner/spinner.props.js';

export type MuiSpinnerProps = SpinnerProps;

export function MuiSpinner({ label }: MuiSpinnerProps) {
  return <CircularProgress aria-label={label} />;
}
