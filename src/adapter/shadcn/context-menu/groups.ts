import type { ContextMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/context-menu/context-menu.props.js';

type Item = ContextMenuProps['items'][number];
type ContentItem = Exclude<Item, { readonly type: 'label' }>;
export interface ContextMenuGroup {
  readonly key: string;
  readonly label?: string;
  readonly items: ContentItem[];
}

export function contextMenuGroups(items: readonly Item[]): ContextMenuGroup[] {
  const groups: ContextMenuGroup[] = [];
  let current: ContextMenuGroup | undefined;
  for (const item of items) {
    if (item.type === 'label') {
      current = { key: item.key, label: item.label, items: [] };
      groups.push(current);
    } else {
      if (current === undefined) {
        current = { key: item.key, items: [] };
        groups.push(current);
      }
      current.items.push(item);
    }
  }
  return groups;
}
