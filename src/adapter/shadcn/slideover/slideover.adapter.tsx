import { Activity } from 'react';
import type { SlideoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/slideover/slideover.props.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import {
  PANEL_DEFAULTS,
  PANEL_POLICY,
  resolvePanelEdge,
} from '@fastsprout/reacd/adapter-runtime/core/panel-policy.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../vendor/ui/sheet.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { CardContent } from '../vendor/ui/card.js';
import { cn } from '../vendor/lib/utils.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';

export function ShadcnSlideover(props: SlideoverProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const retained = props.retainContent ?? MODAL_DEFAULTS.retainContent;
  const dismissible = props.dismissible ?? MODAL_DEFAULTS.dismissible;
  const side = resolvePanelEdge(
    props.placement ?? PANEL_DEFAULTS.slideover,
    scope.direction,
  );
  const full = props.fullscreen ?? MODAL_DEFAULTS.fullscreen;
  const horizontal = side === 'left' || side === 'right';
  return (
    <Sheet
      open={scope.visible}
      onOpenChange={scope.change}
      modal={props.modal ?? MODAL_DEFAULTS.modal}
    >
      {props.triggerLabel && (
        <SheetTrigger asChild>
          <Button type="button" disabled={scope.blocked}
            className={WRAPPING_BUTTON_CLASSES}>
            {props.triggerLabel}
          </Button>
        </SheetTrigger>
      )}
      <Activity mode={retained && !scope.visible ? 'hidden' : 'visible'}>
        <SheetContent
          ref={setHost}
          container={scope.parentHost}
          side={side}
          forceMount={retained ? true : undefined}
          hidden={retained && !scope.visible}
          showCloseButton={false}
          showOverlay={props.overlay ?? MODAL_DEFAULTS.overlay}
          dir={scope.direction}
          className={cn(
            full && 'inset-0 h-dvh w-dvw max-w-none rounded-none sm:max-w-none',
          )}
          style={{
            ...scope.theme,
            overflowY: 'auto',
            overflowWrap: 'anywhere',
            maxInlineSize:
              full || !horizontal
                ? '100dvw'
                : `min(${PANEL_POLICY.widthRem}rem, 100dvw)`,
            maxBlockSize:
              full || horizontal
                ? '100dvh'
                : `${PANEL_POLICY.maximumBlockViewportPercent}dvh`,
          }}
          onCloseAutoFocus={scope.closeAutoFocus}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
        >
          <PortalHostContext value={scope.host}>
            <PortalActiveContext value={scope.visible}>
              <FormScopeContext value={false}>
                <SheetHeader>
                  <SheetTitle>{props.title}</SheetTitle>
                  <SheetDescription>{props.description}</SheetDescription>
                </SheetHeader>
                <CardContent className="min-w-0 px-4 pb-0">
                  {props.children}
                </CardContent>
                <SheetFooter>
                  {props.footer}
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      {props.closeLabel ?? MODAL_DEFAULTS.closeLabel}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </FormScopeContext>
            </PortalActiveContext>
          </PortalHostContext>
        </SheetContent>
      </Activity>
    </Sheet>
  );
}
