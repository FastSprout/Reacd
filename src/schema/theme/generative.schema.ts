import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { themeSchema } from './theme.schema.js';

export interface ThemeNode<Content> extends Omit<
  z.infer<typeof themeSchema>,
  'children'
> {
  type: 'Theme';
  children: Content[];
}

export function themeNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...themeSchema.shape,
    type: z.literal('Theme'),
    children: slot,
  });
}
