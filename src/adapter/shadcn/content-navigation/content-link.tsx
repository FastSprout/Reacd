import type { ContentNavigationItem } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import { CONTENT_OUTLINE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import type { ContentNavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-navigation/index.js';
import { NavigationMenuLink } from '../vendor/ui/navigation-menu.js';

interface ContentLinkProps {
  readonly item: ContentNavigationItem;
  readonly disabled: boolean;
  readonly currentKey?: string | undefined;
  readonly onCurrentChange?: ContentNavigationProps['onCurrentChange'];
}

export function ShadcnContentLink({
  item,
  disabled,
  currentKey,
  onCurrentChange,
}: ContentLinkProps) {
  return (
    <NavigationMenuLink asChild active={currentKey === item.key}>
      <a
        role="link"
        href={disabled ? undefined : item.href}
        aria-current={currentKey === item.key ? 'location' : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        target={item.newWindow ? '_blank' : undefined}
        rel={item.newWindow ? 'noopener noreferrer' : undefined}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          const result: unknown = onCurrentChange?.(item.key);
          if (result !== undefined && typeof result !== 'boolean') {
            throw new Error(CONTENT_OUTLINE_DEFAULTS.invalidSelection);
          }
          if (result === false) event.preventDefault();
        }}
      >
        {item.label}
      </a>
    </NavigationMenuLink>
  );
}
