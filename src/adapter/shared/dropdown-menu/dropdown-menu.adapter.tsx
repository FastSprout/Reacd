import { Menu } from '@base-ui/react/menu';
import type { DropdownMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/dropdown-menu/index.js';
import { ACTION_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/action-menu-policy.js';
import { EscapeScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/escape-context.js';
import { useMenuFrame } from '../action-menu/use-menu-frame.js';
import { MenuItems } from '../action-menu/menu-items.js';
import { MenuSurface } from '../action-menu/menu-surface.js';
import { MenuContent } from '../action-menu/menu-content.js';
import { Button } from '../primitives/button.js';

export function SharedDropdownMenu(properties: DropdownMenuProps) {
  const { label, items, disabled, onOpenChange } = properties;
  const { active, scope, change } = useMenuFrame(properties);
  return (
    <Menu.Root
      open={active}
      onOpenChange={change}
      modal={properties.modal ?? ACTION_MENU_DEFAULTS.modal}
      disabled={disabled}
    >
      <Menu.Trigger
        disabled={disabled}
        render={<Button className="reacd-node reacd-button" />}
      >
        {label}
      </Menu.Trigger>
      <MenuSurface label={label}>
        <EscapeScopeContext.Provider value={scope}>
          <MenuContent close={() => onOpenChange(false)}>
            <MenuItems items={items} />
          </MenuContent>
        </EscapeScopeContext.Provider>
      </MenuSurface>
    </Menu.Root>
  );
}
