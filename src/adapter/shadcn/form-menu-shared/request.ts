import { FORM_MENU_DEFAULTS } from '../../../core/form-menu-policy.js';

export function requestFormMenuChange(request: () => unknown): {
  accepted: boolean;
  error?: string;
} {
  try {
    const result = request();
    if (result === undefined || result === true) return { accepted: true };
    if (result === false) return { accepted: false };
    return { accepted: false, error: FORM_MENU_DEFAULTS.callbackError };
  } catch {
    return { accepted: false, error: FORM_MENU_DEFAULTS.callbackFailure };
  }
}
