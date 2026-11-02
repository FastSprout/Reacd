import type { ContentOutlineItem } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import type { ContentTocProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-toc/content-toc.props.js';
import {
  NavigationMenuItem,
  NavigationMenuList,
} from '../vendor/ui/navigation-menu.js';
import { ShadcnContentLink } from '../content-navigation/content-link.js';

interface TocItemProps {
  readonly item: ContentOutlineItem;
  readonly disabled: boolean;
  readonly currentKey?: string | undefined;
  readonly onCurrentChange?: ContentTocProps['onCurrentChange'];
}

export function ShadcnTocItem({
  item,
  disabled,
  currentKey,
  onCurrentChange,
}: TocItemProps) {
  const blocked = disabled || item.disabled === true;
  return (
    <NavigationMenuItem>
      <ShadcnContentLink
        item={{ ...item, href: `#${encodeURIComponent(item.key)}` }}
        disabled={blocked}
        currentKey={currentKey}
        onCurrentChange={onCurrentChange}
      />
      {item.children && (
        <NavigationMenuList className="flex-col items-stretch pl-4">
          {item.children.map((child) => (
            <ShadcnTocItem
              key={child.key}
              item={child}
              disabled={blocked}
              currentKey={currentKey}
              onCurrentChange={onCurrentChange}
            />
          ))}
        </NavigationMenuList>
      )}
    </NavigationMenuItem>
  );
}
