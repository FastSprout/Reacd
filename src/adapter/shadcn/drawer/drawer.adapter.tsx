import { Drawer } from '@base-ui/react/drawer';
import type { DrawerProps } from '../../../components/drawer/index.js';
import { MODAL_DEFAULTS } from '../../../core/modal-policy.js';
import {
  PANEL_DEFAULTS,
  PANEL_SWIPE,
  resolvePanelEdge,
} from '../../../core/panel-policy.js';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { initialLayerFocus } from '../../../renderer/theme/initial-layer-focus.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '../../../renderer/theme/portal-context.js';
import { Button } from '../vendor/ui/button.js';
import { usePanelFrame } from '../panel/use-panel-frame.js';

export function ShadcnDrawer({
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
  placement = PANEL_DEFAULTS.drawer,
  handle = PANEL_DEFAULTS.handle,
}: DrawerProps) {
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
    <Drawer.Root
      open={active}
      modal={modal}
      onOpenChange={change}
      disablePointerDismissal={!canDismiss}
      swipeDirection={PANEL_SWIPE[edge]}
    >
      {triggerLabel !== undefined && (
        <Drawer.Trigger
          disabled={disabled}
          render={<Button className="reacd-node reacd-button" />}
        >
          {triggerLabel}
        </Drawer.Trigger>
      )}
      <Drawer.Portal
        keepMounted={retainContent}
        hidden={!active}
        className="reacd-root reacd-portal-root reacd-edge-portal"
        style={variables}
        dir={direction}
      >
        {modal && overlay && <Drawer.Backdrop className="reacd-modal-backdrop" />}
        <Drawer.Viewport className="reacd-edge-viewport" data-modal={modal}>
          <Drawer.Popup
            ref={setHost}
            initialFocus={(interaction) => initialLayerFocus(host, interaction)}
            className="reacd-edge-panel reacd-drawer-panel"
            data-edge={edge}
            data-fullscreen={fullscreen}
            aria-modal={modal}
          >
            <PortalHostContext.Provider value={host}>
              <EscapeScopeContext.Provider value={escapeScope}>
                <PortalActiveContext.Provider value={active}>
                  {handle && (
                    <div className="reacd-drawer-grip" aria-hidden="true">
                      <div className="reacd-drawer-handle" />
                    </div>
                  )}
                  <Drawer.Content>
                    <header className="reacd-modal-header">
                      <Drawer.Title>{title}</Drawer.Title>
                      <Drawer.Description>{description}</Drawer.Description>
                    </header>
                    <div className="reacd-modal-body">{children}</div>
                    <footer className="reacd-modal-footer">
                      {footer}
                      <Drawer.Close
                        render={
                          <Button
                            variant="secondary"
                            className="reacd-node reacd-button"
                          />
                        }
                      >
                        {closeLabel}
                      </Drawer.Close>
                    </footer>
                  </Drawer.Content>
                </PortalActiveContext.Provider>
              </EscapeScopeContext.Provider>
            </PortalHostContext.Provider>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
