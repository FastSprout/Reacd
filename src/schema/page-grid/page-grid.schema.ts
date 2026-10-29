import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const pageGridSchema = z.strictObject({
  children: childrenSchema,
});
