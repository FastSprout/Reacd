import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const viewportSchema = z.strictObject({
  children: childrenSchema,
  compact: z.boolean(),
});
