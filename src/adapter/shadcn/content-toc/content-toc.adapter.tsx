import type { ContentTocProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-toc/content-toc.props.js';
import { CONTENT_OUTLINE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import { NavigationMenu, NavigationMenuList } from '../vendor/ui/navigation-menu.js';
import { CardDescription } from '../vendor/ui/card.js';
import { ShadcnTocItem } from './toc-item.js';

export type ShadcnContentTocProps = ContentTocProps;
export function ShadcnContentToc({
  label,
  items,
  currentKey,
  onCurrentChange,
  disabled = false,
  emptyLabel = CONTENT_OUTLINE_DEFAULTS.emptyLabel,
}: ContentTocProps) {
  return (
    <NavigationMenu
      aria-label={label}
      orientation="vertical"
      viewport={false}
      className="max-w-full justify-start"
    >
      {items.length === 0 && <CardDescription>{emptyLabel}</CardDescription>}
      <NavigationMenuList className="flex-col items-stretch">
        {items.map((item) => (
          <ShadcnTocItem
            key={item.key}
            item={item}
            disabled={disabled}
            currentKey={currentKey}
            onCurrentChange={onCurrentChange}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
