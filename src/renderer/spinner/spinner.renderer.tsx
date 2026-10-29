import type { SpinnerProps } from '../../components/spinner/spinner.js';

export function SpinnerSurface({ label }: SpinnerProps) {
  return (
    <p className="reacd-node reacd-spinner" role="status">
      {label}
    </p>
  );
}
