import { TREE_POLICY } from './tree-policy.js';
import type { TreeRow } from './tree.js';

export function treeFocusTarget(
  rows: readonly TreeRow[],
  current: string | undefined,
  key: string,
): string | undefined {
  const enabled = rows.filter((row) => !row.disabled);
  const currentIndex = Math.max(
    0,
    enabled.findIndex((row) => row.id === current),
  );
  let index: number;
  switch (key) {
    case 'Home':
      index = 0;
      break;
    case 'End':
      index = enabled.length - 1;
      break;
    case 'ArrowDown':
      index = Math.min(enabled.length - 1, currentIndex + 1);
      break;
    case 'ArrowUp':
      index = Math.max(0, currentIndex - 1);
      break;
    default:
      return undefined;
  }
  return enabled[index]?.id;
}
export function treeTypeahead(
  rows: readonly TreeRow[],
  current: string | undefined,
  query: string,
): string | undefined {
  const index = rows.findIndex((row) => row.id === current) + 1;
  const candidates = [...rows.slice(index), ...rows.slice(0, index)];
  const prefix = query.toLocaleLowerCase(TREE_POLICY.locale);
  return candidates.find(
    (row) =>
      !row.disabled &&
      row.label.toLocaleLowerCase(TREE_POLICY.locale).startsWith(prefix),
  )?.id;
}
