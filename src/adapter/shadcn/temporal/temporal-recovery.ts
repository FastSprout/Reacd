import type { TemporalLimits, TemporalRange } from '../../../core/date-time.js';

export interface TemporalRecovery<Value> {
  readonly key: string;
  readonly value: Value;
}

export function temporalRecovery<Value extends string | null | TemporalRange>(
  value: Value,
  limits: TemporalLimits,
): TemporalRecovery<Value> {
  const endpoints =
    typeof value === 'object' && value !== null ? [value.start, value.end] : value;
  return { key: JSON.stringify([endpoints, limits.min, limits.max]), value };
}
