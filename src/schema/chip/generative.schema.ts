import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { chipSchema, chipTextSchema } from './chip.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export interface ChipNode<Content> extends Omit<
  z.infer<typeof chipSchema>,
  'children' | 'show' | 'text'
> {
  type: 'Chip';
  children: Content[];
  show?: boolean | z.infer<typeof readStateBindingSchema> | undefined;
  text?:
    z.infer<typeof chipTextSchema> | z.infer<typeof readStateBindingSchema> | undefined;
}
export function chipNodeSchema<Content>(content: z.ZodType<Content>) {
  return z
    .strictObject({
      ...chipSchema.shape,
      type: z.literal('Chip'),
      children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
      show: z.union([z.boolean(), readStateBindingSchema]).optional(),
      text: z.union([chipTextSchema, readStateBindingSchema]).optional(),
    })
    .refine(
      (node) => !node.standalone || node.children.length === 0,
      'Standalone Chip cannot contain children.',
    );
}
