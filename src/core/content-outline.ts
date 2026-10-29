export interface ContentOutlineItem {
  readonly key: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
  readonly children?: readonly ContentOutlineItem[] | undefined;
}

export interface ContentNavigationItem extends Omit<ContentOutlineItem, 'children'> {
  readonly href?: string | undefined;
  readonly newWindow?: boolean | undefined;
  readonly children?: readonly ContentNavigationItem[] | undefined;
}

export function contentOutlineItems(
  items: readonly ContentOutlineItem[],
): readonly ContentOutlineItem[] {
  return items.flatMap((item) => [item, ...contentOutlineItems(item.children ?? [])]);
}

export const CONTENT_OUTLINE_DEFAULTS = {
  emptyLabel: 'No document links.',
  expandLabel: 'Expand',
  collapseLabel: 'Collapse',
  invalidSelection: 'Current callbacks must return a boolean or nothing.',
} as const;
