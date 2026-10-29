import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { fieldGroupSchema } from './field-group.schema.js';

export interface FieldGroupNode<Content> extends Omit<
  z.infer<typeof fieldGroupSchema>,
  'children'
> {
  type: 'FieldGroup';
  children: Content[];
}

export function fieldGroupNodeSchema<Content>(content: z.ZodType<Content>) {
  return z.strictObject({
    ...fieldGroupSchema.shape,
    type: z.literal('FieldGroup'),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
