import { ControlSurface } from '../primitives/control-surface.js';
import { useContext, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useDirection } from '@base-ui/react/direction-provider';
import type { ModalProps } from
  '@fastsprout/reacd/adapter-runtime/components/modal/modal.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { Button } from '../primitives/button.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { createEscapeScope } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-scope.js';
import { initialLayerFocus } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/initial-layer-focus.js';
import {
  PortalHostContext,
  PortalActiveContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

export function SharedModal({
  title,
  description,
  open,
  onOpenChange,
  triggerLabel,
  closeLabel = MODAL_DEFAULTS.closeLabel,
  children,
  footer,
  disabled,
  dismissible = MODAL_DEFAULTS.dismissible,
  modal = MODAL_DEFAULTS.modal,
  overlay = MODAL_DEFAULTS.overlay,
  fullscreen = MODAL_DEFAULTS.fullscreen,
  retainContent = MODAL_DEFAULTS.retainContent,
}: ModalProps) {
  const direction = useDirection();
  const variables = useContext(ThemeVariablesContext);
  const ancestorActive = useContext(PortalActiveContext);
  const active = open && ancestorActive;
  const [escapeScope] = useState(createEscapeScope);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <Dialog.Root
      open={active}
      modal={modal}
      disablePointerDismissal={!dismissible}
      onOpenChange={(next, details) => {
        if (details.reason === 'escape-key' && escapeScope.dismiss()) {
          details.event.preventDefault();
          details.event.stopImmediatePropagation();
          details.cancel();
        } else if (details.reason === 'escape-key' && !dismissible) details.cancel();
        else onOpenChange(next);
      }}
    >
      {triggerLabel !== undefined && (
        <Dialog.Trigger
          disabled={disabled}
          render={<Button className="reacd-node reacd-button" />}
        >
          {triggerLabel}
        </Dialog.Trigger>
      )}
      <Dialog.Portal
        dir={direction}
        keepMounted={retainContent}
        className="reacd-root reacd-portal-root reacd-modal-portal"
        style={variables}
        hidden={!active}
      >
        {modal && overlay && <Dialog.Backdrop className="reacd-modal-backdrop" />}
        <Dialog.Viewport className="reacd-modal-viewport" data-modal={modal}>
          <Dialog.Popup
            render={<ControlSurface />}
            dir={direction}
            ref={setHost}
            initialFocus={(interaction) => initialLayerFocus(host, interaction)}
            finalFocus={ancestorActive ? undefined : false}
            className="reacd-modal-panel"
            data-fullscreen={fullscreen}
            aria-modal={modal}
          >
            <PortalHostContext.Provider value={host}>
              <EscapeScopeContext.Provider value={escapeScope}>
                <PortalActiveContext.Provider value={active}>
                  <header className="reacd-modal-header">
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Description>{description}</Dialog.Description>
                  </header>
                  <div className="reacd-modal-body">{children}</div>
                  <footer className="reacd-modal-footer">
                    {footer}
                    <Dialog.Close
                      render={
                        <Button
                          className="reacd-node reacd-button"
                          variant="secondary"
                        />
                      }
                    >
                      {closeLabel}
                    </Dialog.Close>
                  </footer>
                </PortalActiveContext.Provider>
              </EscapeScopeContext.Provider>
            </PortalHostContext.Provider>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
