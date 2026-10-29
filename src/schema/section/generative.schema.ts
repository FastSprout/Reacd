import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { sectionSchema } from './section.schema.js';

export interface SectionNode<Content> extends Omit<
  z.infer<typeof sectionSchema>,
  'children'
> {
  type: 'Section';
  children: Content[];
}

export function sectionNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...sectionSchema.shape,
    type: z.literal('Section'),
    children: slot,
  });
}
