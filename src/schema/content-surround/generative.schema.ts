import { z } from 'zod';
import { contentSurroundSchema } from './content-surround.schema.js';

export const contentSurroundNodeSchema = contentSurroundSchema.extend({
  type: z.literal('ContentSurround'),
});
