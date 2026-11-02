import type { DateFieldRenderProps } from 'react-aria-components';
import { withinTemporalLimits } from
  '@fastsprout/reacd/adapter-runtime/core/date-time.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';
import type { TemporalFieldProps } from './field.props.js';

export function temporalIssue(props: TemporalFieldProps, value: string | null) {
  const policy = props.kind === 'date' ? INPUT_DATE_POLICY : INPUT_TIME_POLICY;
  if (!withinTemporalLimits(value, props)) return policy.invalidValue;
  if (
    value !== null &&
    props.peer != null &&
    (props.endpoint === 'start' ? value > props.peer : value < props.peer)
  )
    return policy.invalidRange;
  return undefined;
}

export function temporalDraftIssue(
  props: TemporalFieldProps,
  state: DateFieldRenderProps['state'] | null,
) {
  const fields = state?.segments.filter((segment) => segment.isEditable);
  if (
    fields?.some((segment) => segment.isPlaceholder) &&
    (props.value !== null || fields.some((segment) => !segment.isPlaceholder))
  ) {
    return props.kind === 'date'
      ? INPUT_DATE_POLICY.incompleteValue
      : INPUT_TIME_POLICY.incompleteValue;
  }
  return undefined;
}
