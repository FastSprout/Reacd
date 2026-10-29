import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { emptySchema } from './empty.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export interface EmptyNode<Content> extends Omit<
  z.infer<typeof emptySchema>,
  'leading' | 'children' | 'actions' | 'footer' | 'loading'
> {
  type: 'Empty';
  children: Content[];
  leading?: Content[] | undefined;
  actions?: Content[] | undefined;
  footer?: Content[] | undefined;
  loading?: boolean | z.infer<typeof readStateBindingSchema> | undefined;
}
export function emptyNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...emptySchema.shape,
    type: z.literal('Empty'),
    children: slot,
    leading: slot.optional(),
    actions: slot.optional(),
    footer: slot.optional(),
    loading: z.union([z.boolean(), readStateBindingSchema]).optional(),
  });
}
