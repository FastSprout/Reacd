import { z } from 'zod';
import { readStateBindingSchema } from '../state/binding.schema.js';
import { chatShimmerSchema } from './chat-shimmer.schema.js';

export const chatShimmerNodeSchema = z.strictObject({
  type: z.literal('ChatShimmer'),
  text: z.union([chatShimmerSchema.shape.text, readStateBindingSchema]),
  active: z.union([z.boolean(), readStateBindingSchema]).optional(),
});
