import { NavigationMenu } from '@base-ui/react/navigation-menu';
import type { NavigationMenuProps } from '../../../components/navigation-menu/index.js';
import { pressHandler } from '../../../renderer/contracts/press-handler.js';
import { Button } from '../vendor/ui/button.js';

export function MenuTarget({ item }: { item: NavigationMenuProps['items'][number] }) {
  if (item.onPress !== undefined) {
    return (
      <NavigationMenu.Link
        closeOnClick
        className="reacd-node reacd-button reacd-menu-target"
        render={<Button type="button" variant="ghost" disabled={item.disabled} />}
        onClick={pressHandler(item.disabled ? undefined : item.onPress)}
      >
        {item.label}
      </NavigationMenu.Link>
    );
  }
  if (item.href !== undefined && !item.disabled) {
    return (
      <NavigationMenu.Link
        closeOnClick
        className="reacd-node reacd-link reacd-menu-target"
        href={item.href}
        active={item.active}
        target={item.newWindow ? '_blank' : undefined}
        rel={item.newWindow ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </NavigationMenu.Link>
    );
  }
  return (
    <span className="reacd-menu-label" aria-disabled={item.disabled || undefined}>
      {item.label}
    </span>
  );
}
