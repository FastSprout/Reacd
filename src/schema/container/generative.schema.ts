import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface ContainerNode<Content> {
  type: 'Container';
  children: Content[];
}

export function containerNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    type: z.literal('Container'),
    children: slot,
  });
}
