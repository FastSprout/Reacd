import { useState } from 'react';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/input-menu.props.js';
import { menuTextSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-menu-shared/text.schema.js';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { useMenuRequest } from '../select-menu/use-menu-request.js';

export function useInputMenuValue(
  props: InputMenuProps,
  blocked: boolean,
  onAccepted?: (value: string) => void,
) {
  const menu = useMenuRequest();
  const [textError, setTextError] = useState('');
  function request<Value>(
    callback: ((value: Value) => boolean | void) | undefined,
    value: Value,
  ): boolean {
    setTextError('');
    return menu.request(callback, value);
  }
  function requestText(next: string): boolean {
    if (blocked) return false;
    if (!menuTextSchema.safeParse(next).success) {
      setTextError(FORM_MENU_DEFAULTS.invalidText);
      return false;
    }
    setTextError('');
    if (next === props.value) return true;
    const accepted = request(props.onValueChange, next);
    if (accepted) onAccepted?.(next);
    return accepted;
  }
  return { error: textError || menu.error, request, requestText };
}
