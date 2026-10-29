import { useContext, useState } from 'react';
import type { Dialog } from '@base-ui/react/dialog';
import type { Drawer } from '@base-ui/react/drawer';
import { useDirection } from '@radix-ui/react-direction';
import type { ModalProps } from '../../../components/modal/index.js';
import { MODAL_DEFAULTS } from '../../../core/modal-policy.js';
import { ThemeVariablesContext } from '../../../renderer/theme/theme-context.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';

type PanelChange = Dialog.Root.ChangeEventDetails | Drawer.Root.ChangeEventDetails;

export function usePanelFrame({
  open,
  onOpenChange,
  dismissible = MODAL_DEFAULTS.dismissible,
}: Pick<ModalProps, 'open' | 'onOpenChange' | 'dismissible'>) {
  const variables = useContext(ThemeVariablesContext);
  const direction = useDirection();
  const ancestorActive = useContext(PortalActiveContext);
  const [escapeScope] = useState(createEscapeScope);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const change = (next: boolean, details: PanelChange) => {
    if (details.reason === 'escape-key' && escapeScope.dismiss()) {
      details.event.preventDefault();
      details.event.stopImmediatePropagation();
      details.cancel();
    } else if (
      !dismissible &&
      (details.reason === 'escape-key' || details.reason === 'swipe')
    ) {
      details.cancel();
    } else onOpenChange(next);
  };
  return {
    variables,
    direction,
    escapeScope,
    host,
    setHost,
    active: open && ancestorActive,
    dismissible,
    change,
  };
}
