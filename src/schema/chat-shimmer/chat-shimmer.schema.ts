import { z } from 'zod';
import { labelSchema } from '../shared/values.js';

export const chatShimmerSchema = z.strictObject({
  text: labelSchema,
  active: z.boolean().optional(),
});
