import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useDirection } from '@radix-ui/react-direction';
import { Activity, useContext, useRef, useState } from 'react';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import type { ModalProps } from
  '@fastsprout/reacd/adapter-runtime/components/modal/index.js';
import { MODAL_DEFAULTS, MODAL_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../vendor/ui/dialog.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { cn } from '../vendor/lib/utils.js';

import { useShadcnTheme } from '../surface/theme-context.js';

export type ShadcnModalProps = ModalProps & {
  readonly onOpenAutoFocus?: ((event: Event) => void) | undefined;
  readonly onCloseAutoFocus?: ((event: Event) => void) | undefined;
};
export function ShadcnModal({
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
  fullscreen,
  retainContent,
  onOpenAutoFocus,
  onCloseAutoFocus,
}: ShadcnModalProps) {
  const theme = useShadcnTheme();
  const active = useInteractionState().interactive;
  const parentHost = useContext(PortalHostContext);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const visible = active && open;
  const opener = useRef<Element | null>(null);
  const direction = useDirection();
  return (
    <Dialog
      open={visible}
      onOpenChange={(next) => {
        if (active) onOpenChange(next);
      }}
      modal={modal}
    >
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button disabled={disabled} className={WRAPPING_BUTTON_CLASSES}>
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <Activity mode={retainContent && !visible ? 'hidden' : 'visible'}>
        <DialogContent
          ref={setHost}
          container={parentHost}
          dir={direction}
          aria-modal={modal}
          style={{
            ...theme,
            padding: `min(var(--space-large), ` +
              `${MODAL_POLICY.contentPaddingViewportPercent}vi)`,
            overflowY: 'auto',
            overflowWrap: 'anywhere',
            maxBlockSize: fullscreen
              ? '100dvh'
              : 'calc(100dvh - 2 * var(--space-medium))',
          }}
          onCloseAutoFocus={(event) => {
            const target = opener.current;
            opener.current = null;
            if (!active) event.preventDefault();
            else {
              onCloseAutoFocus?.(event);
              if (!event.defaultPrevented && target instanceof HTMLElement &&
                target !== document.body && target.isConnected) {
                event.preventDefault();
                target.focus();
              }
            }
          }}
          onOpenAutoFocus={(event) => {
            opener.current = modal ? document.activeElement : null;
            onOpenAutoFocus?.(event);
          }}
          showCloseButton={false}
          showOverlay={overlay}
          overlayClassName="motion-reduce:animate-none"
          forceMount={retainContent ? true : undefined}
          hidden={retainContent && !visible}
          className={cn(
            'motion-reduce:animate-none',
            fullscreen && 'h-dvh w-dvw max-w-none rounded-none sm:max-w-none',
          )}
          onEscapeKeyDown={(event) => {
            event.stopPropagation();
            if (!dismissible) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
        >
          <PortalHostContext.Provider value={host}>
            <PortalActiveContext.Provider value={visible}>
              <FormScopeContext.Provider value={false}>
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                  {footer}
                  <DialogClose asChild>
                    <Button variant="outline" className={WRAPPING_BUTTON_CLASSES}>
                      {closeLabel}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </FormScopeContext.Provider>
            </PortalActiveContext.Provider>
          </PortalHostContext.Provider>
        </DialogContent>
      </Activity>
    </Dialog>
  );
}
