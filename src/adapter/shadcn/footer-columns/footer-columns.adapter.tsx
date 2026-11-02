import { useContext } from 'react';
import type { FooterColumnsProps } from
  '@fastsprout/reacd/adapter-runtime/components/footer-columns/footer-columns.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { sectionHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { NAVIGATION_COMPOSITION_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/navigation-composition-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import { Button } from '../vendor/ui/button.js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';
import { ShadcnLink } from '../link/link.adapter.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnFooterColumnsProps = FooterColumnsProps;
export function ShadcnFooterColumns({
  label,
  columns,
  left,
  right,
}: FooterColumnsProps) {
  const level = sectionHeadingLevel(useContext(HeadingLevelContext));
  const field = useNativeField({});
  const track = `min(100%, ${POLICY.columnWidthRem}rem)`;
  return (
    <NavigationMenu
      aria-label={label}
      viewport={false}
      className="block w-full min-w-0 max-w-full"
    >
      <CardContent
        className="grid min-w-0 p-0"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${track}, 1fr))`,
          gap: 'var(--space-medium)',
          overflowWrap: 'anywhere',
        }}
      >
        {left !== undefined && (
          <CardContent className="min-w-0 p-0">{left}</CardContent>
        )}
        {columns.map((column) => (
          <CardContent key={column.key} className="min-w-0 p-0">
            <ShadcnProseHeading level={level}>{column.label}</ShadcnProseHeading>
            <NavigationMenuList className="flex-col items-start">
              {column.children.map((item) => {
                const press = item.onPress;
                const disabled = item.disabled || field.blocked;
                return (
                  <NavigationMenuItem key={item.key} className="min-w-0 max-w-full">
                    {item.href ? (
                      <ShadcnLink
                        label={item.label}
                        href={item.href}
                        active={item.active}
                        disabled={disabled}
                        newWindow={item.newWindow}
                      />
                    ) : press ? (
                      <Button
                        type="button"
                        variant="link"
                        disabled={disabled}
                        className="h-auto min-w-0 max-w-full whitespace-normal"
                        style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
                        onClick={() => press()}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <CardDescription>{item.label}</CardDescription>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </CardContent>
        ))}
        {right !== undefined && (
          <CardContent className="min-w-0 p-0">{right}</CardContent>
        )}
      </CardContent>
    </NavigationMenu>
  );
}
