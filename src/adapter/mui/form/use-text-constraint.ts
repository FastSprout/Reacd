import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { InputType } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { inputSubmissionMessage } from
  '@fastsprout/reacd/adapter-runtime/schema/input/submission.js';
import { useFormConstraint } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-validation/use-form-constraint.js';
import { focusMaterialField } from '../native-focus.js';
import type { MaterialFocusHandle } from '../native-focus.js';
import { MuiFormFocusContext } from './focus-context.js';

interface MaterialTextConstraint {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly minLength?: number | undefined;
  readonly inputType?: InputType | undefined;
}

export function useMaterialTextConstraint<
  FocusTarget extends MaterialFocusHandle = HTMLInputElement,
>(props: MaterialTextConstraint) {
  const { id, label, value, required, disabled, minLength, inputType } = props;
  const inputRef = useRef<FocusTarget>(null);
  const focusScope = useContext(MuiFormFocusContext);
  const registerFocus = focusScope?.register;
  const getMessage = useCallback(
    () => inputSubmissionMessage({ value, required, minLength, inputType }),
    [value, required, minLength, inputType],
  );
  const constraint = useMemo(
    () => ({ id, label, getMessage }),
    [id, label, getMessage],
  );
  const focus = useCallback(() => focusMaterialField(inputRef.current), []);
  useEffect(() => {
    if (!disabled) return registerFocus?.(id, focus);
    return undefined;
  }, [disabled, registerFocus, id, focus]);
  const error = useFormConstraint(constraint, disabled);
  return { inputRef, error: error ?? '' };
}
