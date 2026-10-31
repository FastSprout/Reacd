import { openKeyboardContextMenu } from './keyboard-trigger.js';
import { ContextMenu } from '@base-ui/react/context-menu';
import type { ContextMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/context-menu/index.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { useMenuFrame } from '../action-menu/use-menu-frame.js';
import { MenuItems } from '../action-menu/menu-items.js';
import { MenuSurface } from '../action-menu/menu-surface.js';
import { MenuContent } from '../action-menu/menu-content.js';

export function ShadcnContextMenu(properties: ContextMenuProps) {
  const { label, items, disabled, children, onOpenChange } = properties;
  const { active, scope, change } = useMenuFrame(properties);
  return (
    <ContextMenu.Root open={active} onOpenChange={change} disabled={disabled}>
      <ContextMenu.Trigger
        tabIndex={disabled ? undefined : 0}
        onKeyDown={disabled ? undefined : openKeyboardContextMenu}
        role="group"
        aria-label={label}
        aria-disabled={disabled}
        className="reacd-node reacd-context-trigger"
      >
        {children ?? label}
      </ContextMenu.Trigger>
      <MenuSurface label={label} context>
        <EscapeScopeContext.Provider value={scope}>
          <MenuContent close={() => onOpenChange(false)}>
            <MenuItems items={items} />
          </MenuContent>
        </EscapeScopeContext.Provider>
      </MenuSurface>
    </ContextMenu.Root>
  );
}
