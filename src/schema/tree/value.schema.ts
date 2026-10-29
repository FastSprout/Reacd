import { z } from 'zod';
import { TREE_POLICY } from '../../core/tree-policy.js';
import type { TreeNode } from '../../core/tree.js';
import { treeRows } from '../../core/tree.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const treeIdsSchema = z
  .array(stateKeySchema)
  .max(TREE_POLICY.maxNodes)
  .refine((ids) => new Set(ids).size === ids.length, 'Tree ids must be unique.')
  .readonly();
export function treeValueSchema(items: readonly TreeNode[], multiple = false) {
  const ids = new Set(treeRows(items).map((row) => row.id));
  return treeIdsSchema.refine(
    (value) =>
      (multiple || value.length <= TREE_POLICY.singleLimit) &&
      value.every((id) => ids.has(id)),
    'Invalid selected tree ids.',
  );
}
export function treeExpandedSchema(items: readonly TreeNode[]) {
  const branches = new Set(
    treeRows(items)
      .filter((row) => row.branch)
      .map((row) => row.id),
  );
  return treeIdsSchema.refine(
    (value) => value.every((id) => branches.has(id)),
    'Only existing tree branches can be expanded.',
  );
}
