import { Activity } from 'react';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import type { DrawerProps } from
  '@fastsprout/reacd/adapter-runtime/components/drawer/drawer.props.js';
import { MODAL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/modal-policy.js';
import {
  PANEL_DEFAULTS,
  PANEL_POLICY,
  PANEL_SWIPE,
  resolvePanelEdge,
} from '@fastsprout/reacd/adapter-runtime/core/panel-policy.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../vendor/ui/drawer.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { cn } from '../vendor/lib/utils.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { requestDrawerChange } from './native-change.js';

export function ShadcnDrawer(props: DrawerProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const retained = props.retainContent ?? MODAL_DEFAULTS.retainContent;
  const dismissible = props.dismissible ?? MODAL_DEFAULTS.dismissible;
  const modal = props.modal ?? MODAL_DEFAULTS.modal;
  const side = resolvePanelEdge(
    props.placement ?? PANEL_DEFAULTS.drawer,
    scope.direction,
  );
  const full = props.fullscreen ?? MODAL_DEFAULTS.fullscreen;
  const horizontal = side === 'left' || side === 'right';
  const fullSize = full
    ? {
        '--drawer-content-height': '100dvh',
        '--drawer-content-width': '100dvw',
        '--drawer-content-max-height': '100dvh',
        '--drawer-inset': '0px',
      }
    : {};
  return (
    <Drawer
      open={scope.visible}
      swipeDirection={PANEL_SWIPE[side]}
      modal={modal}
      showSwipeHandle={props.handle ?? PANEL_DEFAULTS.handle}
      disablePointerDismissal
      onOpenChange={(next, details) =>
        requestDrawerChange(next, details, dismissible, scope.change)
      }
    >
      {props.triggerLabel && (
        <DrawerTrigger render={<Button type="button" disabled={scope.blocked}
          className={WRAPPING_BUTTON_CLASSES} />}>
          {props.triggerLabel}
        </DrawerTrigger>
      )}
      <Activity mode={retained && !scope.visible ? 'hidden' : 'visible'}>
        <DrawerContent
          ref={setHost}
          portalProps={{
            container: scope.parentHost ?? undefined,
            keepMounted: retained,
            className: 'reacd-native-drawer-portal',
          }}
          showOverlay={props.overlay ?? MODAL_DEFAULTS.overlay}
          dir={scope.direction}
          finalFocus={scope.active}
          className={cn(full && 'inset-0 m-0 h-dvh w-dvw max-w-none rounded-none')}
          style={{
            ...scope.theme,
            ...fullSize,
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
          render={
            <DismissableLayer
              onFocusOutside={(event) => {
                if (modal) event.preventDefault();
              }}
              onDismiss={() => scope.change(false)}
              onEscapeKeyDown={(event) => {
                if (!dismissible) event.preventDefault();
              }}
              onInteractOutside={(event) => {
                if (!dismissible) event.preventDefault();
              }}
            />
          }
        >
          <PortalHostContext value={scope.host}>
            <PortalActiveContext value={scope.visible}>
              <FormScopeContext value={false}>
                <DrawerHeader>
                  <DrawerTitle>{props.title}</DrawerTitle>
                  <DrawerDescription>{props.description}</DrawerDescription>
                </DrawerHeader>
                {props.children}
                <DrawerFooter>
                  {props.footer}
                  <DrawerClose render={<Button type="button" variant="outline" />}>
                    {props.closeLabel ?? MODAL_DEFAULTS.closeLabel}
                  </DrawerClose>
                </DrawerFooter>
              </FormScopeContext>
            </PortalActiveContext>
          </PortalHostContext>
        </DrawerContent>
      </Activity>
    </Drawer>
  );
}
