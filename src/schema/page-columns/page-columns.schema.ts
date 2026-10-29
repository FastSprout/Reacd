import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const pageColumnsSchema = z.strictObject({
  children: childrenSchema,
});
