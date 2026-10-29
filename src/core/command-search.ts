import { COMMAND_POLICY } from './command-policy.js';

export interface CommandSearchItem {
  key: string;
  label: string;
  description?: string | undefined;
  keywords?: readonly string[] | undefined;
}

export interface CommandSearchGroup<Item extends CommandSearchItem> {
  key: string;
  label: string;
  items: readonly Item[];
}

function normalize(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

function rank(item: CommandSearchItem, query: string): number {
  const label = normalize(item.label);
  if (label === query) return COMMAND_POLICY.rank.exact;
  return label.startsWith(query)
    ? COMMAND_POLICY.rank.prefix
    : COMMAND_POLICY.rank.text;
}

function matches(item: CommandSearchItem, terms: readonly string[]): boolean {
  const fields = [item.label, item.description ?? '', ...(item.keywords ?? [])];
  const text = normalize(fields.join(' '));
  return terms.every((term) => text.includes(term));
}

export function filterCommandGroups<Item extends CommandSearchItem>(
  groups: readonly CommandSearchGroup<Item>[],
  query: string,
  filtering: 'local' | 'external',
): CommandSearchGroup<Item>[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const normalizedQuery = terms.join(' ');
  const candidates = groups.flatMap((group) =>
    group.items
      .filter((item) => filtering === 'external' || matches(item, terms))
      .map((item) => ({ group, item })),
  );
  if (filtering === 'local') {
    candidates.sort(
      (left, right) =>
        rank(left.item, normalizedQuery) - rank(right.item, normalizedQuery),
    );
  }
  const admitted = candidates.slice(0, COMMAND_POLICY.maximumResults);
  return groups.flatMap((group) => {
    const items = admitted
      .filter((candidate) => candidate.group === group)
      .map((candidate) => candidate.item);
    return items.length === 0 ? [] : [{ ...group, items }];
  });
}
