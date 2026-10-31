import { useContext, useState } from 'react';
import type { Dialog } from '@base-ui/react/dialog';
import type { Drawer } from '@base-ui/react/drawer';
import { useDirection } from '@radix-ui/react-direction';
import type { ModalProps } from
  '@fastsprout/reacd/adapter-runtime/components/modal/index.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { createEscapeScope } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-scope.js';

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
