import type { ContentSurroundProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-surround/index.js';
import { CONTENT_SURROUND_DEFAULTS as DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-surround-policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { CardDescription, CardTitle } from '../vendor/ui/card.js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';

export type ShadcnContentSurroundProps = ContentSurroundProps;
export function ShadcnContentSurround({
  previous,
  next,
  label = DEFAULTS.label,
  emptyLabel = DEFAULTS.emptyLabel,
}: ContentSurroundProps) {
  const neighbors = [
    ...(previous
      ? [{ key: 'previous', label: DEFAULTS.previousLabel, ...previous }]
      : []),
    ...(next ? [{ key: 'next', label: DEFAULTS.nextLabel, ...next }] : []),
  ];
  const track = `min(100%, ${PAGE_PRESENTATION_POLICY.contentTrackRem}rem)`;
  return (
    <NavigationMenu
      aria-label={label}
      viewport={false}
      className="block w-full min-w-0 max-w-full"
    >
      {neighbors.length === 0 ? (
        <CardDescription>{emptyLabel}</CardDescription>
      ) : (
        <NavigationMenuList
          className="grid w-full min-w-0"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${track}, 1fr))`,
            gap: 'var(--space-medium)',
          }}
        >
          {neighbors.map((item) => (
            <NavigationMenuItem key={item.key}>
              <NavigationMenuLink
                href={item.href}
                target={item.newWindow ? '_blank' : undefined}
                rel={item.newWindow ? 'noopener noreferrer' : undefined}
                className="min-w-0 [overflow-wrap:anywhere]"
              >
                <CardDescription>{item.label}</CardDescription>{' '}
                <CardTitle>{item.title}</CardTitle>{' '}
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}
