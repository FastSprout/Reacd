import { useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { FormValidationContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-validation/context.js';
import { MuiFormFocusContext } from '../form/focus-context.js';
import { focusFieldControl } from './focus-control.js';

interface ControlledFieldError {
  readonly id: string;
  readonly label: string;
  readonly error: string;
  readonly disabled: boolean;
  readonly group: RefObject<HTMLFieldSetElement | null>;
}

export function useControlledError(props: ControlledFieldError): void {
  const { id, label, error, disabled, group } = props;
  const register = useContext(FormValidationContext)?.register;
  const registerFocus = useContext(MuiFormFocusContext)?.register;
  const committed = useRef({ label, error, disabled });
  useLayoutEffect(() => {
    committed.current = { label, error, disabled };
  }, [label, error, disabled]);
  const constraint = useMemo(
    () => ({
      id,
      get label() {
        return committed.current.label;
      },
      getMessage: () =>
        committed.current.disabled ? undefined : committed.current.error || undefined,
    }),
    [id],
  );
  const focus = useCallback(() => focusFieldControl(group.current), [group]);
  useLayoutEffect(() => {
    if (!disabled) return registerFocus?.(id, focus);
    return undefined;
  }, [disabled, registerFocus, id, focus]);
  useLayoutEffect(() => register?.(constraint), [register, constraint]);
  useLayoutEffect(() => {
    register?.(constraint);
  }, [disabled, register, constraint, label, error]);
}
