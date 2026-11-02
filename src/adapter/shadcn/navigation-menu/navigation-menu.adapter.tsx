import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import { NAVIGATION_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../vendor/ui/navigation-menu.js';
import { CardDescription } from '../vendor/ui/card.js';
import { ShadcnNavigationTarget } from './navigation-target.js';
import { cn } from '../vendor/lib/utils.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';

export type ShadcnNavigationMenuProps = NavigationMenuProps;
export function ShadcnNavigationMenu({
  label,
  items,
  orientation = NAVIGATION_COMPOSITION_DEFAULTS.orientation,
}: NavigationMenuProps) {
  return (
    <NavigationMenu
      aria-label={label}
      orientation={orientation}
      viewport={false}
      className={[
        'min-w-0 max-w-full justify-start',
        '[&>div]:min-w-0 [&>div]:max-w-full',
      ].join(' ')}
    >
      <NavigationMenuList
        className={cn(
          'min-w-0 max-w-full flex-wrap',
          orientation === 'vertical' && 'flex-col items-stretch',
        )}
      >
        {items.map((item) => (
          <NavigationMenuItem key={item.key} className="min-w-0 max-w-full">
            {item.children ? (
              <>
                <NavigationMenuTrigger disabled={item.disabled}
                  className={`${WRAPPING_BUTTON_CLASSES} w-auto [&>svg]:shrink-0`}>
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                  {item.children.map((child) => (
                    <ShadcnNavigationTarget key={child.key} item={child} />
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <ShadcnNavigationTarget item={item} />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
