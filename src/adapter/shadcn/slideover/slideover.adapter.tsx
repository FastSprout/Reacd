import { Dialog } from '@base-ui/react/dialog';
import type { SlideoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/slideover/index.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import {
  PANEL_DEFAULTS,
  resolvePanelEdge,
} from '@fastsprout/reacd/adapter-runtime/core/panel-policy.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { initialLayerFocus } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/initial-layer-focus.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Button } from '../vendor/ui/button.js';
import { usePanelFrame } from '../panel/use-panel-frame.js';

export function ShadcnSlideover({
  title,
  description,
  open,
  onOpenChange,
  triggerLabel,
  children,
  footer,
  disabled,
  dismissible,
  closeLabel = MODAL_DEFAULTS.closeLabel,
  modal = MODAL_DEFAULTS.modal,
  overlay = MODAL_DEFAULTS.overlay,
  fullscreen = MODAL_DEFAULTS.fullscreen,
  retainContent = MODAL_DEFAULTS.retainContent,
  placement = PANEL_DEFAULTS.slideover,
}: SlideoverProps) {
  const {
    active,
    change,
    direction,
    escapeScope,
    host,
    setHost,
    variables,
    dismissible: canDismiss,
  } = usePanelFrame({ open, onOpenChange, dismissible });
  const edge = resolvePanelEdge(placement, direction);
  return (
    <Dialog.Root
      open={active}
      modal={modal}
      onOpenChange={change}
      disablePointerDismissal={!canDismiss}
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
        keepMounted={retainContent}
        hidden={!active}
        className="reacd-root reacd-portal-root reacd-edge-portal"
        style={variables}
        dir={direction}
      >
        {modal && overlay && <Dialog.Backdrop className="reacd-modal-backdrop" />}
        <Dialog.Viewport className="reacd-edge-viewport" data-modal={modal}>
          <Dialog.Popup
            ref={setHost}
            initialFocus={(interaction) => initialLayerFocus(host, interaction)}
            className="reacd-edge-panel"
            data-edge={edge}
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
                          variant="secondary"
                          className="reacd-node reacd-button"
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
