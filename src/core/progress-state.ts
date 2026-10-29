import { PROGRESS_POLICY } from './element-policy.js';

export function progressState(
  value: number | null | undefined,
  max: number = PROGRESS_POLICY.max,
) {
  const indeterminate = value === null || value === undefined;
  const percent = indeterminate
    ? 0
    : Number(
        ((value / max) * PROGRESS_POLICY.percentScale).toFixed(
          PROGRESS_POLICY.fractionDigits,
        ),
      );
  return {
    indeterminate,
    percent,
    text: indeterminate ? PROGRESS_POLICY.indeterminateLabel : `${percent}%`,
  };
}
