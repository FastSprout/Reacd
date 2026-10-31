import { useTemporalChange } from '../temporal/use-temporal-change.js';
import type { TemporalRecovery } from '../temporal/temporal-recovery.js';

interface TimeProtection {
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
}

export function useTimeChange<Value>(
  validate: (value: Value) => boolean,
  onValueChange: (value: Value) => void,
  message: string,
  protection: TimeProtection,
  recovery?: TemporalRecovery<Value>,
) {
  return useTemporalChange(validate, onValueChange, message, protection, recovery);
}
