import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { separatorSchema } from './separator.schema.js';

export interface SeparatorNode<Content> extends Omit<
  z.infer<typeof separatorSchema>,
  'children'
> {
  type: 'Separator';
  children: Content[];
}

export function separatorNodeSchema<Content>(content: z.ZodType<Content>) {
  return z.strictObject({
    ...separatorSchema.shape,
    type: z.literal('Separator'),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
