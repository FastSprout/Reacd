import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageCTASchema } from './page-cta.schema.js';

export interface PageCTANode<Content> extends Omit<
  z.infer<typeof pageCTASchema>,
  'children' | 'links' | 'header' | 'footer' | 'top' | 'bottom'
> {
  type: 'PageCTA';
  children: Content[];
  links?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
}

export function pageCTANodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageCTASchema.shape,
    type: z.literal('PageCTA'),
    children: slot,
    links: slot.optional(),
    header: slot.optional(),
    footer: slot.optional(),
    top: slot.optional(),
    bottom: slot.optional(),
  });
}
