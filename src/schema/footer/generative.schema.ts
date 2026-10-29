import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface FooterNode<Content> {
  type: 'Footer';
  children: Content[];
  start?: Content[] | undefined;
  end?: Content[] | undefined;
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
}

export function footerNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    type: z.literal('Footer'),
    children: slot,
    start: slot.optional(),
    end: slot.optional(),
    top: slot.optional(),
    bottom: slot.optional(),
  });
}
