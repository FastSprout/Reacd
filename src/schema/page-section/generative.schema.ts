import { validPageAnchor } from '../shared/identifier.js';
import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageSectionSchema } from './page-section.schema.js';

export interface PageSectionNode<Content> extends Omit<
  z.infer<typeof pageSectionSchema>,
  'children' | 'links' | 'header' | 'footer' | 'top' | 'bottom' | 'leading' | 'features'
> {
  type: 'PageSection';
  children: Content[];
  links?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
  leading?: Content[] | undefined;
  features?: Content[] | undefined;
}

export function pageSectionNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const shape = pageSectionSchema.shape;
  return z
    .strictObject({
      ...shape,
      type: z.literal('PageSection'),
      children: slot,
      links: slot.optional(),
      header: slot.optional(),
      footer: slot.optional(),
      top: slot.optional(),
      bottom: slot.optional(),
      leading: slot.optional(),
      features: slot.optional(),
    })
    .refine(validPageAnchor, 'An anchor requires a named title.');
}
