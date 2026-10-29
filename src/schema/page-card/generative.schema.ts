import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageCardSchema } from './page-card.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { validPageTitleAction } from '../shared/page-presentation.js';

export interface PageCardNode<Content> extends Omit<
  z.infer<typeof pageCardSchema>,
  'children' | 'leading' | 'header' | 'footer' | 'onPress'
> {
  type: 'PageCard';
  children: Content[];
  leading?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  action?: string | undefined;
}

export function pageCardNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const { onPress: _onPress, ...shape } = pageCardSchema.shape;
  return z
    .strictObject({
      ...shape,
      type: z.literal('PageCard'),
      children: slot,
      leading: slot.optional(),
      header: slot.optional(),
      footer: slot.optional(),
      action: stateKeySchema.optional(),
    })
    .refine(validPageTitleAction, 'Provide a named link or action, never both.');
}
