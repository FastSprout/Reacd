import { z } from 'zod';
import { progressGroupSchema } from './progress-group.schema.js';
export const progressGroupNodeSchema = progressGroupSchema.extend({
  type: z.literal('ProgressGroup'),
});
