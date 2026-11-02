import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import { useFormConstraint } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-validation/use-form-constraint.js';
import { MuiFormFocusContext } from '../form/focus-context.js';

interface PinValidation {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly length: number;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly error: string;
}

export function usePinValidation(props: PinValidation) {
  const { id, label, value, length, required, disabled, error } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const registerFocus = useContext(MuiFormFocusContext)?.register;
  const getMessage = useCallback(() => {
    if (error) return error;
    if ((!required && value === '') || value.length === length) return undefined;
    return PIN_INPUT_POLICY.incompleteMessage;
  }, [error, required, value, length]);
  const constraint = useMemo(() => ({ id, label, getMessage }),
    [id, label, getMessage]);
  const focus = useCallback(() => inputRef.current?.focus(), []);
  useEffect(() => {
    if (!disabled) return registerFocus?.(id, focus);
    return undefined;
  }, [disabled, registerFocus, id, focus]);
  const message = useFormConstraint(constraint, disabled);
  return { inputRef, message };
}
