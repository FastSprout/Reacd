import { useContext, useEffect, useState } from 'react';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import {
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

export function useNativePopup(enabled = true) {
  const active = useInteractionState().interactive && enabled;
  const host = useContext(PortalHostContext);
  const [open, setOpen] = useState(false);
  useEffect(() => () => setOpen(false), [active]);
  return {
    active,
    host,
    open: active && open,
    onOpenChange: (next: boolean) => {
      if (active) setOpen(next);
    },
  };
}
