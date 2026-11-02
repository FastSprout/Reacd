import { useState } from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import type { DropdownMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/dropdown-menu/dropdown-menu.props.js';
import {
  ACTION_MENU_DEFAULTS,
  ACTION_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../vendor/ui/button.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../vendor/ui/dropdown-menu.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { ShadcnMenuItems } from './menu-items.js';
import { requestContextChange } from '../context-menu/native-change.js';

export type ShadcnDropdownMenuProps = DropdownMenuProps;

export function ShadcnDropdownMenu(props: ShadcnDropdownMenuProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const [error, setError] = useState('');
  return (
    <DirectionProvider direction={scope.direction}>
      <DropdownMenu
        open={scope.visible && !scope.blocked}
        modal={props.modal ?? ACTION_MENU_DEFAULTS.modal}
        onOpenChange={(open, details) => {
          setError('');
          requestContextChange(open, details, scope.change);
        }}
      >
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              disabled={scope.blocked}
              className="h-auto min-w-0 max-w-full whitespace-normal break-words"
              style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
            />
          }
        >
          {props.label}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          aria-label={props.label}
          dir={scope.direction}
          ref={setHost}
          container={scope.parentHost ?? undefined}
          finalFocus={scope.active}
          sideOffset={ACTION_MENU_POLICY.offsetPx}
          collisionPadding={ACTION_MENU_POLICY.collisionPaddingPx}
          className="min-w-0 motion-reduce:animate-none [overflow-wrap:anywhere]"
          style={{
            ...scope.theme,
            inlineSize: `${ACTION_MENU_POLICY.widthRem}rem`,
            maxInlineSize: 'var(--available-width)',
          }}
          render={<DismissableLayer onDismiss={() => scope.change(false)} />}
        >
          <ShadcnMenuItems
            items={props.items}
            host={scope.parentHost}
            report={setError}
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </DirectionProvider>
  );
}
