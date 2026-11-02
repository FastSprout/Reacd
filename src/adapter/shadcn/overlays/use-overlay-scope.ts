import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useContext, useState } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import {
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { useShadcnTheme } from '../surface/theme-context.js';

export function useOverlayScope({
  open,
  disabled,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly disabled?: boolean | undefined;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const active = useInteractionState().interactive;
  const parentHost = useContext(PortalHostContext);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const field = useNativeField({ disabled });
  const direction = useDirection();
  const theme = useShadcnTheme();
  return {
    active,
    parentHost,
    host,
    setHost,
    direction,
    theme,
    blocked: field.blocked,
    visible: active && open,
    closeAutoFocus: (event: Event) => {
      if (!active) event.preventDefault();
    },
    change: (next: boolean) => {
      if (active && (!next || !field.blocked)) onOpenChange(next);
    },
  };
}
