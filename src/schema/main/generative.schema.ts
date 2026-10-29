import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface MainNode<Content> {
  type: 'Main';
  children: Content[];
}

export function mainNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    type: z.literal('Main'),
    children: slot,
  });
}
