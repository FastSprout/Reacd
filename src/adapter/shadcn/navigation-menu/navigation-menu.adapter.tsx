import { useContext } from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useDirection } from '@radix-ui/react-direction';
import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import {
  NAVIGATION_COMPOSITION_DEFAULTS,
  NAVIGATION_COMPOSITION_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Button } from '../vendor/ui/button.js';
import { MenuTarget } from './menu-target.js';

export function ShadcnNavigationMenu({
  label,
  items,
  orientation = NAVIGATION_COMPOSITION_DEFAULTS.orientation,
}: NavigationMenuProps) {
  const variables = useContext(ThemeVariablesContext);
  const host = useContext(PortalHostContext);
  const direction = useDirection();
  const side =
    orientation === 'horizontal' ? 'bottom' : direction === 'rtl' ? 'left' : 'right';
  return (
    <NavigationMenu.Root<string>
      className="reacd-node reacd-navigation-menu"
      aria-label={label}
      orientation={orientation}
      data-orientation={orientation}
      delay={NAVIGATION_COMPOSITION_POLICY.disclosureDelayMs}
      closeDelay={NAVIGATION_COMPOSITION_POLICY.disclosureDelayMs}
    >
      <NavigationMenu.List className="reacd-menu-list">
        {items.map((item) => (
          <NavigationMenu.Item key={item.key} value={item.key}>
            {item.children === undefined ? (
              <MenuTarget item={item} />
            ) : (
              <>
                <NavigationMenu.Trigger
                  className="reacd-node reacd-button reacd-menu-trigger"
                  disabled={item.disabled}
                  render={<Button type="button" variant="ghost" />}
                >
                  {item.label}
                  <NavigationMenu.Icon
                    aria-hidden="true"
                    className="reacd-menu-disclosure"
                  >
                    ⌄
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="reacd-menu-content">
                  {item.description !== undefined && <p>{item.description}</p>}
                  <ul className="reacd-menu-child-list">
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <MenuTarget item={child} />
                      </li>
                    ))}
                  </ul>
                </NavigationMenu.Content>
              </>
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      <NavigationMenu.Portal container={host ?? undefined}>
        <NavigationMenu.Positioner
          className="reacd-root reacd-portal-root reacd-menu-positioner"
          side={side}
          sideOffset={NAVIGATION_COMPOSITION_POLICY.popupOffsetPx}
          collisionPadding={NAVIGATION_COMPOSITION_POLICY.collisionPaddingPx}
          style={variables}
          dir={direction}
        >
          <NavigationMenu.Popup className="reacd-menu-popup">
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
