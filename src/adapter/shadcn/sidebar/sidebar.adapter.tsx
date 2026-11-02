import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { Activity, useContext, useLayoutEffect, useRef, useState } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import type { SidebarProps } from
  '@fastsprout/reacd/adapter-runtime/components/sidebar/sidebar.props.js';
import {
  SIDEBAR_DEFAULTS,
  SIDEBAR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/sidebar-policy.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from '../vendor/ui/card.js';
import { Button } from '../vendor/ui/button.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../vendor/ui/collapsible.js';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../vendor/ui/sheet.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { usePageWidth } from '../page/use-page-width.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { cn } from '../vendor/lib/utils.js';

const actionStyle = {
  height: 'auto',
  minBlockSize: LAYOUT_POLICY.controlTargetPx,
  overflowWrap: 'anywhere',
} as const;

export type ShadcnSidebarProps = SidebarProps & {
  readonly narrow?: boolean;
  readonly showTrigger?: boolean;
};
export function ShadcnSidebar({
  narrow: override,
  showTrigger = true,
  ...properties
}: ShadcnSidebarProps) {
  const {
    title,
    description = SIDEBAR_DEFAULTS.description,
    children,
    header,
    footer,
    actions,
    collapsedContent,
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
  } = properties;
  const active = useContext(PortalActiveContext);
  const interactive = useInteractionState().interactive;
  const parentHost = useContext(PortalHostContext);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const metadata = useNativeField({ disabled });
  const theme = useShadcnTheme();
  const direction = useDirection();
  const { setElement, measured, widthRem } = usePageWidth();
  const narrow =
    collapsible !== 'none' &&
    (override ?? (measured && widthRem < LAYOUT_POLICY.splitTrackRem));
  const mode = useRef(narrow);
  const opener = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    mode.current = narrow;
  }, [narrow]);
  const expanded = collapsible === 'none' || open;
  const visible = interactive && mobileOpen;
  return (
    <CardContent ref={setElement} className="min-w-0 p-0">
      {narrow && showTrigger && (
        <Button
          type="button"
          variant="outline"
          className="min-w-0 max-w-full whitespace-normal break-words"
          style={actionStyle}
          aria-haspopup="dialog"
          aria-expanded={visible}
          disabled={metadata.blocked}
          onClick={(event) => {
            event.currentTarget.focus();
            onMobileOpenChange(!mobileOpen);
          }}
        >
          {toggleLabel}
        </Button>
      )}
      {narrow ? (
        <Sheet
          open={visible}
          onOpenChange={(next) => {
            if (!metadata.blocked) onMobileOpenChange(next);
          }}
        >
          <Activity mode={visible ? 'visible' : 'hidden'}>
            <SheetContent
              ref={setHost}
              dir={direction}
              container={parentHost}
              forceMount
              showCloseButton={false}
              hidden={!visible}
              side={(side === 'end') !== (direction === 'rtl') ? 'right' : 'left'}
              className="overflow-hidden"
              style={{ ...theme, overflowWrap: 'anywhere' }}
              onOpenAutoFocus={() => {
                const element = document.activeElement;
                opener.current = element instanceof HTMLElement ? element : null;
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (mode.current && opener.current?.isConnected) opener.current.focus();
              }}
            >
              <PortalHostContext value={host}>
                <PortalActiveContext value={visible}>
                  <FormScopeContext value={false}>
                    <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
                      <SheetHeader>
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription>{description}</SheetDescription>
                        {header}
                        {actions}
                      </SheetHeader>
                      <CardContent>{children}</CardContent>
                      <SheetFooter>{footer}</SheetFooter>
                    </CardContent>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="min-w-0 max-w-full whitespace-normal break-words"
                          style={actionStyle}
                          disabled={metadata.blocked}
                        >
                          {closeLabel}
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </FormScopeContext>
                </PortalActiveContext>
              </PortalHostContext>
            </SheetContent>
          </Activity>
        </Sheet>
      ) : (
        <Collapsible
          open={expanded}
          disabled={metadata.blocked}
          onOpenChange={onOpenChange}
        >
          <Card
            role="complementary"
            aria-label={title}
            hidden={!expanded && collapsible === 'offcanvas' && !showTrigger}
            className={cn(
              'min-w-0',
              variant === 'sidebar' && 'rounded-none shadow-none',
              variant === 'inset' && 'border-0 shadow-none',
            )}
            style={{
              maxInlineSize: `${
                expanded ? SIDEBAR_POLICY.inlineRem : SIDEBAR_POLICY.iconInlineRem
              }rem`,
              overflowWrap: 'anywhere',
              marginInlineStart: side === 'end' ? 'auto' : undefined,
            }}
          >
            {showTrigger && collapsible !== 'none' && (
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="min-w-0 max-w-full whitespace-normal break-words"
                  style={actionStyle}
                >
                  {toggleLabel}
                </Button>
              </CollapsibleTrigger>
            )}
            {!expanded && collapsible === 'icon' && collapsedContent}
            <CollapsibleContent forceMount hidden={!expanded}>
              <PortalActiveContext value={active && expanded}>
                <CardHeader>
                  <CardDescription>{title}</CardDescription>
                  <CardDescription>{description}</CardDescription>
                  {header}
                  {actions}
                </CardHeader>
                <CardContent>{children}</CardContent>
                <CardFooter className="flex-wrap">{footer}</CardFooter>
              </PortalActiveContext>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </CardContent>
  );
}
