import { useId } from 'react';
import type { ProgressProps } from '../../../components/progress/progress.js';
import { PROGRESS_POLICY } from '../../../core/element-policy.js';
import { progressState } from '../../../core/progress-state.js';
import * as Progress from '@radix-ui/react-progress';

export function ShadcnProgress({
  label,
  value,
  max = PROGRESS_POLICY.max,
  description,
  showValue = PROGRESS_POLICY.showValue,
}: ProgressProps) {
  const id = useId();
  const state = progressState(value, max);
  return (
    <div className="reacd-node reacd-field">
      <span id={id}>{label}</span>
      <Progress.Root
        value={value ?? null}
        max={max}
        className="reacd-progress-track"
        aria-labelledby={id}
        aria-describedby={description === undefined ? undefined : `${id}-help`}
        data-indeterminate={state.indeterminate}
      >
        <Progress.Indicator
          className="reacd-progress-fill"
          style={{ inlineSize: `${state.percent}%` }}
        />
      </Progress.Root>
      {description === undefined ? null : <span id={`${id}-help`}>{description}</span>}
      {showValue ? <span>{state.text}</span> : null}
    </div>
  );
}
