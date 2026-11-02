import { useState } from 'react';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';

export function useMenuRequest() {
  const [error, setError] = useState('');
  function request<Value>(
    callback: ((value: Value) => boolean | void) | undefined,
    value: Value,
  ): boolean {
    try {
      const result: unknown = callback?.(value);
      if (result !== undefined && typeof result !== 'boolean') {
        if (result instanceof Promise) void result.catch(() => undefined);
        setError(FORM_MENU_DEFAULTS.callbackError);
        return false;
      }
      setError('');
      return result !== false;
    } catch {
      setError(FORM_MENU_DEFAULTS.callbackFailure);
      return false;
    }
  }
  return { error, request };
}
