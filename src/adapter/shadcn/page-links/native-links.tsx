import type { PageAnchorsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-anchors/page-anchors.props.js';
import { PAGE_LINK_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-navigation-policy.js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';

export function ShadcnPageNativeLinks({
  label,
  links = PAGE_LINK_DEFAULTS.links,
  activeKey,
}: PageAnchorsProps) {
  return (
    <NavigationMenu
      aria-label={label}
      orientation="vertical"
      viewport={false}
      className="min-w-0 max-w-full justify-start"
    >
      <NavigationMenuList className="flex-col items-stretch">
        {links.map((item) => (
          <NavigationMenuItem key={item.key}>
            <NavigationMenuLink
              href={item.href}
              active={item.key === activeKey}
              target={item.newWindow ? '_blank' : undefined}
              rel={item.newWindow ? 'noopener noreferrer' : undefined}
              className="flex-row flex-wrap [overflow-wrap:anywhere]"
            >
              {item.leading}{' '}
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
