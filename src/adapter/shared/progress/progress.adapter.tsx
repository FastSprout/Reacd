import { ControlPart } from '../primitives/control-part.js';
import { useId } from 'react';
import type { ProgressProps } from
  '@fastsprout/reacd/adapter-runtime/components/progress/progress.js';
import { PROGRESS_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';
import { progressState } from
  '@fastsprout/reacd/adapter-runtime/core/progress-state.js';
import * as Progress from '@radix-ui/react-progress';

export function SharedProgress({
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
        asChild
        value={value ?? null}
        max={max}
        className="reacd-progress-track"
        aria-labelledby={id}
        aria-describedby={description === undefined ? undefined : `${id}-help`}
        data-indeterminate={state.indeterminate}
      >
        <ControlPart part="track">
          <Progress.Indicator
            asChild
            className="reacd-progress-fill"
            style={{ inlineSize: `${state.percent}%` }}
          >
            <ControlPart part="indicator" />
          </Progress.Indicator>
        </ControlPart>
      </Progress.Root>
      {description === undefined ? null : <span id={`${id}-help`}>{description}</span>}
      {showValue ? <span>{state.text}</span> : null}
    </div>
  );
}
