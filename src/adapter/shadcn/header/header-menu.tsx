import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { useContext, useState } from 'react';
import { Menu } from 'lucide-react';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.props.js';
import {
  SHELL_DEFAULTS,
  SHELL_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../vendor/ui/dialog.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../vendor/ui/sheet.js';
import { Button } from '../vendor/ui/button.js';
import { useShadcnTheme } from '../surface/theme-context.js';

export function ShadcnHeaderMenu({
  title,
  menu,
}: {
  readonly title: string;
  readonly menu: NonNullable<HeaderProps['menu']>;
}) {
  const theme = useShadcnTheme();
  const active = useInteractionState().interactive;
  const parentHost = useContext(PortalHostContext);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const mode = menu.mode ?? SHELL_DEFAULTS.menuMode;
  const visible = active && menu.open;
  const changed = (open: boolean) => {
    if (active) menu.onOpenChange(open);
  };
  const trigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={menu.toggleLabel ?? SHELL_DEFAULTS.toggleLabel}
      style={{
        minInlineSize: LAYOUT_POLICY.controlTargetPx,
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
      }}
    >
      <Menu />
    </Button>
  );
  const body = (
    <PortalHostContext.Provider value={host}>
      <PortalActiveContext.Provider value={visible}>
        <FormScopeContext.Provider value={false}>
          {menu.content}
        </FormScopeContext.Provider>
      </PortalActiveContext.Provider>
    </PortalHostContext.Provider>
  );
  const closeLabel = menu.closeLabel ?? SHELL_DEFAULTS.closeLabel;
  const close = (
    <Button
      type="button"
      variant="outline"
      className="h-auto max-w-full whitespace-normal break-words"
    >
      {closeLabel}
    </Button>
  );
  return mode === 'modal' ? (
    <Dialog open={visible} onOpenChange={changed}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        ref={setHost}
        container={parentHost}
        style={{
          ...theme,
          gridTemplateColumns: 'minmax(0, 1fr)',
          maxBlockSize: `${SHELL_POLICY.menuBlockPercent}dvh`,
          overflowY: 'auto',
          overflowWrap: 'anywhere',
        }}
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          if (!active) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{SHELL_DEFAULTS.menuDescription}</DialogDescription>
        </DialogHeader>
        {body}
        <DialogClose asChild>{close}</DialogClose>
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={visible} onOpenChange={changed}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        ref={setHost}
        container={parentHost}
        showCloseButton={false}
        side={mode === 'drawer' ? 'bottom' : 'right'}
        onCloseAutoFocus={(event) => {
          if (!active) event.preventDefault();
        }}
        style={{
          ...theme,
          overflowY: 'auto',
          overflowWrap: 'anywhere',
          maxBlockSize: `${SHELL_POLICY.menuBlockPercent}dvh`,
          ...(mode === 'slideover'
            ? {
                inlineSize: `min(${SHELL_POLICY.menuWidthRem}rem, 100vw)`,
              }
            : {}),
        }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{SHELL_DEFAULTS.menuDescription}</SheetDescription>
        </SheetHeader>
        {body}
        <SheetClose asChild>{close}</SheetClose>
      </SheetContent>
    </Sheet>
  );
}
