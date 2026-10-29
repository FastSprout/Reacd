import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageFeatureSchema } from './page-feature.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { validPageTitleAction } from '../shared/page-presentation.js';

export interface PageFeatureNode<Content> extends Omit<
  z.infer<typeof pageFeatureSchema>,
  'children' | 'leading' | 'onPress'
> {
  type: 'PageFeature';
  children: Content[];
  leading?: Content[] | undefined;
  action?: string | undefined;
}

export function pageFeatureNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const { onPress: _onPress, ...shape } = pageFeatureSchema.shape;
  return z
    .strictObject({
      ...shape,
      type: z.literal('PageFeature'),
      children: slot,
      leading: slot.optional(),
      action: stateKeySchema.optional(),
    })
    .refine(validPageTitleAction, 'Provide a named link or action, never both.');
}
