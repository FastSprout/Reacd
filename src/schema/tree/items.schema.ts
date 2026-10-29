import { z } from 'zod';
import type { TreeNode } from '../../core/tree.js';
import { treeRows } from '../../core/tree.js';
import { TREE_POLICY } from '../../core/tree-policy.js';
import { boundedTree } from '../../core/tree-budget.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema } from '../shared/values.js';

export const treeItemSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z
    .strictObject({
      id: stateKeySchema,
      label: labelSchema,
      disabled: z.boolean().optional(),
      children: z
        .array(treeItemSchema)
        .min(1)
        .max(TREE_POLICY.maxNodes)
        .readonly()
        .optional(),
    })
    .readonly(),
);
export const treeItemsSchema = z
  .unknown()
  .refine(boundedTree, {
    message: 'Tree structure is cyclic or exceeds its size budget.',
    abort: true,
  })
  .pipe(z.array(treeItemSchema).max(TREE_POLICY.maxNodes).readonly())
  .refine((items) => {
    const rows = treeRows(items);
    return new Set(rows.map((item) => item.id)).size === rows.length;
  }, 'Tree node identifiers must be unique.');
