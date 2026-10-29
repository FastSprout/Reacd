import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageHeroSchema } from './page-hero.schema.js';

export interface PageHeroNode<Content> extends Omit<
  z.infer<typeof pageHeroSchema>,
  'children' | 'links' | 'header' | 'footer' | 'top' | 'bottom'
> {
  type: 'PageHero';
  children: Content[];
  links?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
}

export function pageHeroNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const shape = pageHeroSchema.shape;
  return z.strictObject({
    ...shape,
    type: z.literal('PageHero'),
    children: slot,
    links: slot.optional(),
    header: slot.optional(),
    footer: slot.optional(),
    top: slot.optional(),
    bottom: slot.optional(),
  });
}
