import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { appSchema } from './app.schema.js';

export interface AppNode<Content> extends Omit<z.infer<typeof appSchema>, 'children'> {
  type: 'App';
  children: Content[];
}

export function appNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...appSchema.shape,
    type: z.literal('App'),
    children: slot,
  });
}
