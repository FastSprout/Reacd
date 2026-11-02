import { useState } from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import type { ContextMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/context-menu/context-menu.props.js';
import { ACTION_MENU_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '../vendor/ui/context-menu.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { ShadcnContextItems } from './menu-items.js';
import { requestContextChange } from './native-change.js';

export function ShadcnContextMenu(props: ContextMenuProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const [error, setError] = useState('');
  const [keyboardAnchor, setKeyboardAnchor] = useState<HTMLElement | null>(null);
  const change = (open: boolean) => {
    setError('');
    scope.change(open);
  };
  return (
    <DirectionProvider direction={scope.direction}>
      <ContextMenu
        open={scope.visible && !scope.blocked}
        disabled={scope.blocked}
        onOpenChange={(open, details) => requestContextChange(open, details, change)}
      >
        <ContextMenuTrigger
          role="group"
          aria-label={props.label}
          aria-haspopup="menu"
          aria-expanded={scope.visible && !scope.blocked}
          aria-disabled={scope.blocked || undefined}
          tabIndex={scope.blocked ? -1 : 0}
          onKeyDown={(event) => {
            if (scope.blocked) return;
            if (event.key === 'ContextMenu' ||
              (event.key === 'F10' && event.shiftKey)) {
              event.preventDefault();
              setKeyboardAnchor(event.currentTarget);
              change(true);
            }
          }}
          onContextMenu={() => setKeyboardAnchor(null)}
          onTouchStart={() => setKeyboardAnchor(null)}
        >
          {props.children}
        </ContextMenuTrigger>
        <ContextMenuContent
          aria-label={props.label}
          ref={setHost}
          container={scope.parentHost ?? undefined}
          finalFocus={scope.active}
          anchor={keyboardAnchor ?? undefined}
          collisionPadding={ACTION_MENU_POLICY.collisionPaddingPx}
          className="[overflow-wrap:anywhere]"
          style={{
            ...scope.theme,
            inlineSize: `${ACTION_MENU_POLICY.widthRem}rem`,
            maxInlineSize: 'var(--available-width)',
          }}
          render={<DismissableLayer onDismiss={() => change(false)} />}
        >
          <PortalHostContext value={scope.host}>
            <PortalActiveContext value={scope.visible && !scope.blocked}>
              <ShadcnContextItems
                items={props.items}
                host={scope.host}
                report={setError}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </PortalActiveContext>
          </PortalHostContext>
        </ContextMenuContent>
      </ContextMenu>
    </DirectionProvider>
  );
}
