import { useId } from 'react';
import type { ProgressProps } from
  '@fastsprout/reacd/adapter-runtime/components/progress/progress.props.js';
import { PROGRESS_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';
import { Progress } from '../vendor/ui/progress.js';
import { Label } from '../vendor/ui/label.js';

export type ShadcnProgressProps = ProgressProps;
export function ShadcnProgress({
  label,
  value,
  max = PROGRESS_POLICY.max,
  description,
  showValue,
}: ProgressProps) {
  const id = useId();
  const percentage = value == null ? undefined : (value / max) * PROGRESS_POLICY.max;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Progress
        id={id}
        aria-label={label}
        value={percentage}
        aria-valuenow={value == null ? undefined : value}
        aria-valuemax={max}
        aria-describedby={description ? `${id}-help` : undefined}
      />
      {description && <p id={`${id}-help`}>{description}</p>}
      {showValue && value != null && <p>{`${value} / ${max}`}</p>}
    </div>
  );
}
