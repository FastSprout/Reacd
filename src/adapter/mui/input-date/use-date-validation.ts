import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { DateValidationError } from '@mui/x-date-pickers/models';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { inputSubmissionMessage } from
  '@fastsprout/reacd/adapter-runtime/schema/input/submission.js';
import { useFormConstraint } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-validation/use-form-constraint.js';
import { MuiFormFocusContext } from '../form/focus-context.js';
import { focusMaterialField } from '../native-focus.js';

interface DateValidationOptions {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly required: boolean;
  readonly disabled: boolean;
}

export function useDateValidation(options: DateValidationOptions) {
  const { id, label, value, required, disabled } = options;
  const [draft, setDraft] = useState<{
    readonly value: string;
    readonly error: DateValidationError;
  }>({ value, error: null });
  const nativeError = draft.value === value ? draft.error : null;
  const onError = useCallback((error: DateValidationError) => {
    setDraft({ value, error });
  }, [value]);
  const inputRef = useRef<HTMLInputElement>(null);
  const registerFocus = useContext(MuiFormFocusContext)?.register;
  const getMessage = useCallback(
    () => nativeError ? INPUT_DATE_POLICY.invalidValue :
      inputSubmissionMessage({ value, required }),
    [nativeError, value, required],
  );
  const constraint = useMemo(
    () => ({ id, label, getMessage }), [id, label, getMessage],
  );
  const focus = useCallback(() => focusMaterialField(inputRef.current), []);
  useEffect(() => {
    if (!disabled) return registerFocus?.(id, focus);
    return undefined;
  }, [disabled, registerFocus, id, focus]);
  const validationError = useFormConstraint(constraint, disabled);
  return { inputRef, onError, error: nativeError
    ? INPUT_DATE_POLICY.invalidValue : validationError ?? '' };
}
