import { z } from 'zod';
import { bannerSchema } from './banner.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface BannerNode<Content> extends Omit<
  z.infer<typeof bannerSchema>,
  'open' | 'onOpenChange' | 'actions'
> {
  type: 'Banner';
  open: z.infer<typeof writeStateBindingSchema>;
  actions?: Content[] | undefined;
}
export function bannerNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = bannerSchema.shape;
  return z.strictObject({
    ...properties,
    type: z.literal('Banner'),
    open: writeStateBindingSchema,
    actions: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
  });
}
