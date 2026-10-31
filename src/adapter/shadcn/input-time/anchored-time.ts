import { parseZonedDateTime } from '@internationalized/date';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';

export function anchoredTime(value: string) {
  return parseZonedDateTime(
    `${INPUT_TIME_POLICY.anchorDate}T${value}[${INPUT_TIME_POLICY.anchorTimeZone}]`,
  );
}
