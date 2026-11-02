import type { SiteNavigation } from './content/model.js';
import type { SiteSearchEntry } from './app/model.js';
import { SITE_POLICY } from './policy.js';

export function filterNavigation(
  items: readonly SiteNavigation[],
  query: string,
): readonly SiteNavigation[] {
  const needle = query.trim().toLocaleLowerCase('en');
  if (!needle) return items;
  return items.flatMap((item) => {
    if (item.label.toLocaleLowerCase('en').includes(needle)) return [item];
    const children = filterNavigation(item.children ?? [], needle);
    return children.length ? [{ ...item, children }] : [];
  });
}

export function expandedNavigation(items: readonly SiteNavigation[]): string[] {
  return items.flatMap((item) =>
    item.children ? [item.key, ...expandedNavigation(item.children)] : [],
  );
}

export function searchGroups(pages: readonly SiteSearchEntry[]) {
  const groups = [];
  for (let offset = 0; offset < pages.length; offset += SITE_POLICY.searchGroupSize) {
    groups.push({
      key: `pages-${offset}`,
      label: 'Documentation',
      items: pages
        .slice(offset, offset + SITE_POLICY.searchGroupSize)
        .map((page, index) => ({
          key: `page-${offset + index}`,
          label: page.title,
          description: page.description,
          href: page.route,
        })),
    });
  }
  return groups;
}

export function currentNavigationKey(
  items: readonly SiteNavigation[],
  route: string,
): string | undefined {
  for (const item of items) {
    if (item.href === route) return item.key;
    const nested = currentNavigationKey(item.children ?? [], route);
    if (nested !== undefined) return nested;
  }
  return undefined;
}

function firstDestination(item: SiteNavigation): string | undefined {
  if (item.href !== undefined) return item.href;
  for (const child of item.children ?? []) {
    const destination = firstDestination(child);
    if (destination !== undefined) return destination;
  }
  return undefined;
}

export function sectionLinks(items: readonly SiteNavigation[]) {
  return items.flatMap((item) => {
    const href = firstDestination(item);
    return href === undefined ? [] : [{ key: item.key, label: item.label, href }];
  });
}
