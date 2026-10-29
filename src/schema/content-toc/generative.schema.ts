import { z } from 'zod';
import { contentTocContentSchema } from './content-toc.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

export const contentTocNodeSchema = contentTocContentSchema.extend({
  type: z.literal('ContentToc'),
  currentKey: stateBindingSchema,
});
export type ContentTocNode = z.infer<typeof contentTocNodeSchema>;
