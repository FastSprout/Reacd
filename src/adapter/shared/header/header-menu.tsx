import { ControlSurface } from '../primitives/control-surface.js';
import { useContext, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.js';
import { SHELL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { createEscapeScope } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-scope.js';
import { initialLayerFocus } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/initial-layer-focus.js';
import { Button } from '../primitives/button.js';

interface HeaderMenuProps {
  title: string;
  menu: NonNullable<HeaderProps['menu']>;
}

export function SharedHeaderMenu({ title, menu }: HeaderMenuProps) {
  const variables = useContext(ThemeVariablesContext);
  const ancestorActive = useContext(PortalActiveContext);
  const [escapeScope] = useState(createEscapeScope);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <Dialog.Root
      open={menu.open && ancestorActive}
      onOpenChange={(open, details) => {
        if (details.reason === 'escape-key' && escapeScope.dismiss()) {
          details.event.preventDefault();
          details.event.stopImmediatePropagation();
          details.cancel();
        } else menu.onOpenChange(open);
      }}
    >
      <Dialog.Trigger
        render={<Button className="reacd-node reacd-button" variant="secondary" />}
      >
        {menu.toggleLabel ?? SHELL_DEFAULTS.toggleLabel}
      </Dialog.Trigger>
      <Dialog.Portal className="reacd-root reacd-portal-root" style={variables}>
        <Dialog.Backdrop className="reacd-shell-backdrop" />
        <Dialog.Popup
          render={<ControlSurface />}
          ref={setHost}
          className="reacd-shell-menu"
          initialFocus={(interaction) => initialLayerFocus(host, interaction)}
          data-mode={menu.mode ?? SHELL_DEFAULTS.menuMode}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{SHELL_DEFAULTS.menuDescription}</Dialog.Description>
          <PortalHostContext.Provider value={host}>
            <EscapeScopeContext.Provider value={escapeScope}>
              <PortalActiveContext.Provider value={menu.open && ancestorActive}>
                <div className="reacd-shell-menu-content">{menu.content}</div>
              </PortalActiveContext.Provider>
            </EscapeScopeContext.Provider>
          </PortalHostContext.Provider>
          <Dialog.Close
            render={<Button className="reacd-node reacd-button" variant="secondary" />}
          >
            {menu.closeLabel ?? SHELL_DEFAULTS.closeLabel}
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
