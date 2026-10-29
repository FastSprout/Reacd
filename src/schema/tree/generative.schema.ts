import { z } from 'zod';
import { treeContentSchema } from './tree.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
export const treeNodeSchema = treeContentSchema.extend({
  type: z.literal('Tree'),
  value: stateBindingSchema,
  expanded: stateBindingSchema,
});
export type TreeNodeDeclaration = z.infer<typeof treeNodeSchema>;
