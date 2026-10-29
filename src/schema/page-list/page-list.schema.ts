import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const pageListSchema = z.strictObject({
  children: childrenSchema,
  divide: z.boolean().optional(),
});
