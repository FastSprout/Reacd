import { ControlSurface } from '../primitives/control-surface.js';
import { useContext, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Popover } from '@base-ui/react/popover';
import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.js';
import {
  POPOVER_DEFAULTS,
  POPOVER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/popover-policy.js';
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
import { useEscapeLayer } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/use-escape-layer.js';
import { initialLayerFocus } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/initial-layer-focus.js';
import { Button } from '../primitives/button.js';

export function SharedPopover({
  title,
  triggerLabel,
  description,
  open,
  onOpenChange,
  children,
  footer,
  disabled,
  closeLabel = POPOVER_DEFAULTS.closeLabel,
  placement = POPOVER_DEFAULTS.placement,
  align = POPOVER_DEFAULTS.align,
  arrow = POPOVER_DEFAULTS.arrow,
  modal = POPOVER_DEFAULTS.modal,
  dismissible = POPOVER_DEFAULTS.dismissible,
  retainContent = POPOVER_DEFAULTS.retainContent,
  mode = POPOVER_DEFAULTS.mode,
  openDelay = POPOVER_DEFAULTS.openDelay,
  closeDelay = POPOVER_DEFAULTS.closeDelay,
}: PopoverProps) {
  const variables = useContext(ThemeVariablesContext);
  const ancestorActive = useContext(PortalActiveContext);
  const parentHost = useContext(PortalHostContext);
  const active = open && ancestorActive;
  const focusModal = modal && mode === 'click';
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [escapeScope] = useState(createEscapeScope);
  const [hoverOpened, setHoverOpened] = useState(false);
  function closeLayer() {
    if (!escapeScope.dismiss() && dismissible) onOpenChange(false);
  }
  useEscapeLayer(active, closeLayer);
  function keyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && active) {
      event.stopPropagation();
      if (!event.defaultPrevented) closeLayer();
    }
  }
  return (
    <Popover.Root
      open={active}
      modal={focusModal}
      onOpenChange={(next, details) => {
        if (details.reason === 'escape-key' && details.event.defaultPrevented) {
          details.cancel();
        } else if (details.reason === 'escape-key' && escapeScope.dismiss()) {
          details.event.preventDefault();
          details.event.stopImmediatePropagation();
          details.cancel();
        } else if (
          !dismissible &&
          (details.reason === 'escape-key' ||
            details.reason === 'outside-press' ||
            details.reason === 'focus-out')
        ) {
          details.cancel();
        } else {
          setHoverOpened(next && details.reason === 'trigger-hover');
          onOpenChange(next);
        }
      }}
    >
      <Popover.Trigger
        disabled={disabled}
        openOnHover={mode === 'hover'}
        delay={POPOVER_POLICY.openDelay[openDelay]}
        closeDelay={POPOVER_POLICY.closeDelay[closeDelay]}
        onKeyDown={keyDown}
        render={<Button className="reacd-node reacd-button" />}
      >
        {triggerLabel}
      </Popover.Trigger>
      <Popover.Portal
        container={parentHost ?? undefined}
        keepMounted={retainContent}
        hidden={!active}
        className="reacd-popover-portal"
      >
        <Popover.Positioner
          side={placement}
          align={align}
          sideOffset={POPOVER_POLICY.sideOffsetPx}
          collisionPadding={POPOVER_POLICY.collisionPaddingPx}
          style={variables}
          className="reacd-root reacd-portal-root reacd-popover-positioner"
        >
          <Popover.Popup
            render={<ControlSurface />}
            ref={setHost}
            className="reacd-popover-popup"
            data-slot="popover-content"
            onKeyDown={keyDown}
            aria-modal={focusModal}
            style={{ pointerEvents: POPOVER_POLICY.pointerEvents }}
            initialFocus={
              mode === 'hover' && hoverOpened
                ? false
                : (interaction) => initialLayerFocus(host, interaction)
            }
          >
            <PortalHostContext.Provider value={host}>
              <EscapeScopeContext.Provider value={escapeScope}>
                <PortalActiveContext.Provider value={active}>
                  <div className="reacd-popover-scroll">
                    <header className="reacd-popover-header">
                      <Popover.Title>{title}</Popover.Title>
                      {description !== undefined && (
                        <Popover.Description>{description}</Popover.Description>
                      )}
                    </header>
                    <div className="reacd-popover-body">{children}</div>
                    <footer className="reacd-popover-footer">
                      {footer}
                      <Popover.Close
                        render={
                          <Button
                            variant="secondary"
                            className="reacd-node reacd-button"
                          />
                        }
                      >
                        {closeLabel}
                      </Popover.Close>
                    </footer>
                  </div>
                  {arrow && <Popover.Arrow className="reacd-popover-arrow" />}
                </PortalActiveContext.Provider>
              </EscapeScopeContext.Provider>
            </PortalHostContext.Provider>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
