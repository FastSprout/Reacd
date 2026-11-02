import type { NavigationMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/navigation-menu/index.js';
import { Button } from '../vendor/ui/button.js';
import { CardDescription } from '../vendor/ui/card.js';
import { NavigationMenuLink } from '../vendor/ui/navigation-menu.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';

type Target = Omit<NavigationMenuProps['items'][number], 'children' | 'description'>;
export function ShadcnNavigationTarget({ item }: { readonly item: Target }) {
  if (item.href !== undefined)
    return (
      <NavigationMenuLink asChild active={item.active}
        className={WRAPPING_BUTTON_CLASSES}>
        <a
          role="link"
          href={item.disabled ? undefined : item.href}
          aria-current={item.active ? 'page' : undefined}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : undefined}
          target={item.newWindow ? '_blank' : undefined}
          rel={item.newWindow ? 'noopener noreferrer' : undefined}
          onClick={(event) => {
            if (item.disabled) event.preventDefault();
          }}
        >
          {item.label}
        </a>
      </NavigationMenuLink>
    );
  const action = item.onPress;
  if (action !== undefined)
    return (
      <NavigationMenuLink asChild>
        <Button
          className={WRAPPING_BUTTON_CLASSES}
          type="button"
          variant="ghost"
          disabled={item.disabled}
          onClick={() => action()}
        >
          {item.label}
        </Button>
      </NavigationMenuLink>
    );
  return <CardDescription className="min-w-0 [overflow-wrap:anywhere]">
    {item.label}
  </CardDescription>;
}
