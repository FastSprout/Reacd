import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Menu } from '@base-ui/react/menu';
import { ContextMenu } from '@base-ui/react/context-menu';
import { useDirection } from '@radix-ui/react-direction';
import { ACTION_MENU_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

export function MenuSurface({
  label,
  children,
  context = false,
  submenu = false,
}: {
  label: string;
  children: ReactNode;
  context?: boolean;
  submenu?: boolean;
}) {
  const host = useContext(PortalHostContext);
  const variables = useContext(ThemeVariablesContext);
  const direction = useDirection();
  const Positioner = context ? ContextMenu.Positioner : Menu.Positioner;
  return (
    <Menu.Portal container={host ?? undefined}>
      <Positioner
        className="reacd-root reacd-portal-root reacd-action-positioner"
        style={variables}
        dir={direction}
        side={submenu ? (direction === 'rtl' ? 'left' : 'right') : 'bottom'}
        align="start"
        sideOffset={ACTION_MENU_POLICY.offsetPx}
        collisionPadding={ACTION_MENU_POLICY.collisionPaddingPx}
      >
        <Menu.Popup className="reacd-action-popup" aria-label={label}>
          {children}
        </Menu.Popup>
      </Positioner>
    </Menu.Portal>
  );
}
