import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { ContextMenu as Primitive } from '@base-ui/react/context-menu';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import type { ContextMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/context-menu/context-menu.props.js';
import { ACTION_MENU_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import {
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '../vendor/ui/context-menu.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { requestContextChange } from './native-change.js';

export function ShadcnContextSubmenu({
  item,
  host,
  children,
}: {
  readonly item: Extract<ContextMenuProps['items'][number], { type: 'submenu' }>;
  readonly host: HTMLElement | null;
  readonly children: ReactNode;
}) {
  const actions = useRef<Primitive.Root.Actions | null>(null);
  const theme = useShadcnTheme();
  return (
    <ContextMenuSub
      actionsRef={actions}
      onOpenChange={(open, details) =>
        requestContextChange(open, details, () => undefined)
      }
    >
      <ContextMenuSubTrigger disabled={item.disabled}>
        {item.label}
      </ContextMenuSubTrigger>
      <ContextMenuSubContent
        aria-label={item.label}
        container={host ?? undefined}
        collisionPadding={ACTION_MENU_POLICY.collisionPaddingPx}
        className="[overflow-wrap:anywhere]"
        style={{ ...theme, maxInlineSize: 'var(--available-width)' }}
        render={<DismissableLayer onDismiss={() => actions.current?.close()} />}
      >
        {children}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
