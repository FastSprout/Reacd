import type { SpinnerProps } from
  '@fastsprout/reacd/adapter-runtime/components/spinner/spinner.props.js';
import { Spinner } from '../vendor/ui/spinner.js';

export type ShadcnSpinnerProps = SpinnerProps;
export function ShadcnSpinner({ label }: SpinnerProps) {
  return <Spinner aria-label={label} className="motion-reduce:animate-none" />;
}
