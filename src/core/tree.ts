import { TREE_POLICY } from './tree-policy.js';

export interface TreeNode {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
  readonly children?: readonly TreeNode[] | undefined;
}
export interface TreeRow extends TreeNode {
  readonly parent: string | undefined;
  readonly level: number;
  readonly position: number;
  readonly size: number;
  readonly branch: boolean;
}
export function treeRows(
  items: readonly TreeNode[],
  expanded?: readonly string[],
  parent?: string,
  level: number = TREE_POLICY.initialLevel,
): TreeRow[] {
  return items.flatMap((item, index) => {
    const children = item.children ?? [];
    const row = {
      ...item,
      parent,
      level,
      size: items.length,
      position: index + TREE_POLICY.initialPosition,
      branch: children.length > 0,
    };
    return [
      row,
      ...(expanded === undefined || expanded.includes(item.id)
        ? treeRows(children, expanded, item.id, level + TREE_POLICY.initialLevel)
        : []),
    ];
  });
}
export function treeSelection(
  value: readonly string[],
  id: string,
  multiple: boolean,
): readonly string[] {
  if (!multiple) return [id];
  return value.includes(id) ? value.filter((key) => key !== id) : [...value, id];
}
export function treeExpansion(
  expanded: readonly string[],
  id: string,
): readonly string[] {
  return expanded.includes(id)
    ? expanded.filter((key) => key !== id)
    : [...expanded, id];
}
