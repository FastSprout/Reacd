import {
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useDirection } from '@base-ui/react/direction-provider';
import type { SidebarProps } from
  '@fastsprout/reacd/adapter-runtime/components/sidebar/sidebar.props.js';
import { SIDEBAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/sidebar-policy.js';
import { useNarrowContainer } from
  '@fastsprout/reacd/adapter-runtime/renderer/responsive/index.js';
import { SidebarEnvironmentContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/sidebar/sidebar-environment.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { createEscapeScope } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-scope.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Button } from '../primitives/button.js';

export function SharedSidebar({
  title,
  description = SIDEBAR_DEFAULTS.description,
  open,
  onOpenChange,
  mobileOpen,
  onMobileOpenChange,
  side = SIDEBAR_DEFAULTS.side,
  variant = SIDEBAR_DEFAULTS.variant,
  collapsible = SIDEBAR_DEFAULTS.collapsible,
  toggleLabel = SIDEBAR_DEFAULTS.toggleLabel,
  closeLabel = SIDEBAR_DEFAULTS.closeLabel,
  disabled,
  children,
  header,
  footer,
  actions,
  collapsedContent,
}: SidebarProps) {
  const reference = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const attach = useCallback((element: HTMLDivElement | null) => {
    reference.current = element;
    setContainer(element);
  }, []);
  const measuredNarrow = useNarrowContainer(reference);
  const environment = useContext(SidebarEnvironmentContext);
  const narrow = environment?.narrow ?? measuredNarrow;
  const direction = useDirection();
  const variables = useContext(ThemeVariablesContext);
  const ancestorActive = useContext(PortalActiveContext);
  const [escapeScope] = useState(createEscapeScope);
  const restore = useRef(false);
  const fixed = collapsible === 'none';
  const mobile = narrow && !fixed;
  useLayoutEffect(() => {
    if (!mobile) restore.current = false;
  }, [mobile]);
  const expanded = fixed || (mobile ? mobileOpen : open);
  const active = expanded && ancestorActive;
  const change = (next: boolean) => {
    if (mobile) {
      restore.current = true;
      onMobileOpenChange(next);
    } else onOpenChange(next);
  };
  return (
    <div ref={attach} className="reacd-node reacd-sidebar-shell">
      <Dialog.Root
        open={active}
        modal={mobile}
        disablePointerDismissal={!mobile}
        onOpenChange={(next, details) => {
          if (details.reason === 'escape-key' && escapeScope.dismiss()) {
            details.event.preventDefault();
            details.event.stopImmediatePropagation();
            details.cancel();
          } else if (!fixed) change(next);
          else details.cancel();
        }}
      >
        {!fixed && environment === null && (
          <Button
            ref={trigger}
            className="reacd-node reacd-button"
            variant="secondary"
            disabled={disabled}
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => change(!expanded)}
          >
            {toggleLabel}
          </Button>
        )}
        {!expanded && collapsible === 'icon' && !mobile && (
          <aside className="reacd-sidebar-collapsed" aria-label={title}>
            {collapsedContent}
          </aside>
        )}
        {container !== null && (
          <Dialog.Portal keepMounted container={container} hidden={!active}>
            {mobile && <Dialog.Backdrop className="reacd-shell-backdrop" />}
            <Dialog.Popup
              id={id}
              render={<aside />}
              role={mobile ? 'dialog' : 'complementary'}
              aria-modal={mobile || undefined}
              hidden={!active}
              initialFocus={mobile}
              finalFocus={() => {
                if (restore.current)
                  return environment === null
                    ? trigger.current
                    : environment.trigger.current;
                return false;
              }}
              className="reacd-root reacd-sidebar"
              style={variables}
              data-mobile={mobile}
              data-side={side}
              data-direction={direction}
              data-variant={variant}
            >
              <EscapeScopeContext.Provider value={escapeScope}>
                <PortalActiveContext.Provider value={active}>
                  {mobile && (
                    <Dialog.Close
                      disabled={disabled}
                      render={
                        <Button
                          className="reacd-node reacd-button"
                          variant="secondary"
                        />
                      }
                    >
                      {closeLabel}
                    </Dialog.Close>
                  )}
                  <div className="reacd-sidebar-scroll">
                    <header className="reacd-sidebar-header">
                      <Dialog.Title>{title}</Dialog.Title>
                      <Dialog.Description>{description}</Dialog.Description>
                      {header}
                      {actions}
                    </header>
                    <div className="reacd-sidebar-content">{children}</div>
                    <footer className="reacd-sidebar-footer">{footer}</footer>
                  </div>
                </PortalActiveContext.Provider>
              </EscapeScopeContext.Provider>
            </Dialog.Popup>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </div>
  );
}
