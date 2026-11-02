import { useShellHeight } from '../layout/use-shell-height.js';
import { Children } from 'react';
import { SHELL_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.props.js';
import { CardContent, CardHeader, CardTitle } from '../vendor/ui/card.js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';
import { ShadcnHeaderMenu } from './header-menu.js';
import { documentationLayoutVariables } from '../layout/layout-variables.js';

export type ShadcnHeaderProps = HeaderProps;
export function ShadcnHeader({
  title,
  href,
  start,
  children,
  end,
  top,
  bottom,
  menu,
}: HeaderProps) {
  const setElement = useShellHeight();
  const replacement =
    (menu?.replacesNavigation ?? SHELL_DEFAULTS.replacesNavigation) &&
    Children.toArray(children).length + Children.toArray(bottom).length > 0;
  const brand = (
    <CardTitle style={{ fontSize: 'var(--shell-brand-title)' }}>{title}</CardTitle>
  );
  return (
    <CardHeader
      ref={setElement}
      role="banner"
      data-navigation-replacement={replacement ? true : undefined}
      className="reacd-shell space-y-0 p-0"
      style={documentationLayoutVariables}
    >
      {top}
      <CardContent className="reacd-shell-row p-0">
        <CardContent className="reacd-shell-branding flex flex-wrap items-center p-0">
          {href === undefined ? (
            brand
          ) : (
            <NavigationMenu viewport={false} aria-label={title}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a href={href}>{brand}</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {start}
        </CardContent>
        {children != null && (
          <CardContent className="reacd-shell-navigation p-0">{children}</CardContent>
        )}
        <CardContent className="reacd-shell-controls p-0">
          {end}
          {menu && (
            <CardContent className="reacd-shell-menu-trigger p-0">
              <ShadcnHeaderMenu title={title} menu={menu} />
            </CardContent>
          )}
        </CardContent>
      </CardContent>
      {bottom != null && (
        <CardContent className="reacd-shell-secondary p-0">{bottom}</CardContent>
      )}
    </CardHeader>
  );
}
