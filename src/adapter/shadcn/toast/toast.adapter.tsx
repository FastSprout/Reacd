import { useContext, useId } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import type { ToastProps } from '../../../components/toast/index.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '../../../renderer/theme/portal-context.js';
import { ThemeVariablesContext } from '../../../renderer/theme/theme-context.js';
import { ToastRegistration } from './toast-registration.js';
export function ShadcnToast(properties: ToastProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  const variables = useContext(ThemeVariablesContext);
  const direction = useDirection();
  const host = useContext(PortalHostContext);
  return properties.open && active ? (
    <ToastRegistration
      id={id}
      properties={properties}
      variables={variables}
      direction={direction}
      host={host}
    />
  ) : null;
}
