import { createContext, useContext } from 'react';
import { FORM_DEFAULTS } from '../../core/form-policy.js';
import { PortalActiveContext } from '../theme/portal-context.js';

export const FormPendingContext = createContext<boolean>(FORM_DEFAULTS.submitting);

export interface InteractionState {
  readonly active: boolean;
  readonly pending: boolean;
  readonly interactive: boolean;
}

export function useInteractionState(): InteractionState {
  const active = useContext(PortalActiveContext);
  const pending = useContext(FormPendingContext);
  return { active, pending, interactive: active && !pending };
}
