import { useState } from 'react';
import type { TemporalRecovery } from './temporal-recovery.js';

interface TemporalProtection {
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
}

export function useTemporalChange<Value>(
  validate: (value: Value) => boolean,
  onValueChange: (value: Value) => void,
  message: string,
  protection: TemporalProtection,
  recovery?: TemporalRecovery<Value>,
) {
  const [failure, setFailure] = useState<{
    message: string;
    basis: string | undefined;
  }>();
  const recovered =
    failure !== undefined &&
    recovery !== undefined &&
    failure.basis !== recovery.key &&
    validate(recovery.value);
  if (recovered) setFailure(undefined);
  function change(value: Value) {
    if (protection.disabled || protection.readOnly) return;
    if (!validate(value)) {
      setFailure({ message, basis: recovery?.key });
      return;
    }
    setFailure(undefined);
    onValueChange(value);
  }
  return { error: recovered ? undefined : failure?.message, change };
}
