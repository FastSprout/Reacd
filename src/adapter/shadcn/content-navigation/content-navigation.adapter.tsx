import type { ContentNavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-navigation/index.js';
import { CONTENT_OUTLINE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from
  '../vendor/ui/navigation-menu.js';
import { Accordion } from '../vendor/ui/accordion.js';
import { CardDescription } from '../vendor/ui/card.js';
import { ShadcnContentBranch } from './content-branch.js';

export type ShadcnContentNavigationProps = ContentNavigationProps;
export function ShadcnContentNavigation({
  label,
  items,
  expandedKeys,
  onExpandedKeysChange,
  currentKey,
  onCurrentChange,
  disabled = false,
  expansionReadOnly = false,
  emptyLabel = CONTENT_OUTLINE_DEFAULTS.emptyLabel,
}: ContentNavigationProps) {
  return (
    <NavigationMenu aria-label={label} orientation="vertical" viewport={false}
      className="max-w-full min-w-0 justify-start">
      <NavigationMenuList className="w-full flex-col items-stretch">
        <NavigationMenuItem className="w-full">
    <Accordion
      type="multiple"
      value={[...expandedKeys]}
      disabled={disabled}
      onValueChange={onExpandedKeysChange}
    >
      {items.length === 0 && <CardDescription>{emptyLabel}</CardDescription>}
      {items.map((item) => (
        <ShadcnContentBranch
          key={item.key}
          item={item}
          disabled={disabled}
          readOnly={expansionReadOnly}
          currentKey={currentKey}
          onCurrentChange={onCurrentChange}
        />
      ))}
    </Accordion>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
