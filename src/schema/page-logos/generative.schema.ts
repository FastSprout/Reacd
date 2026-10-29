import { z } from 'zod';
import { pageLogosSchema } from './page-logos.schema.js';

export const pageLogosNodeSchema = pageLogosSchema.extend({
  type: z.literal('PageLogos'),
});
export type PageLogosNode = z.infer<typeof pageLogosNodeSchema>;
