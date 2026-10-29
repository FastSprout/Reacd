import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { errorSchema } from './error.schema.js';

export interface ErrorNode<Content> extends Omit<
  z.infer<typeof errorSchema>,
  'children' | 'leading' | 'actions'
> {
  type: 'Error';
  children: Content[];
  leading?: Content[] | undefined;
  actions?: Content[] | undefined;
}

export function errorNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...errorSchema.shape,
    type: z.literal('Error'),
    children: slot,
    leading: slot.optional(),
    actions: slot.optional(),
  });
}
