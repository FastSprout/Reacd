import { useContext, useEffect } from 'react';
import type { FormConstraint } from '../../core/form-constraint.js';
import { FormValidationContext } from './context.js';

export function useFormConstraint(
  constraint: FormConstraint,
  disabled: boolean,
): string | undefined {
  const scope = useContext(FormValidationContext);
  const register = scope?.register;
  useEffect(() => {
    if (!disabled) return register?.(constraint);
    return undefined;
  }, [constraint, disabled, register]);
  return scope?.attempted && !disabled ? constraint.getMessage() : undefined;
}
