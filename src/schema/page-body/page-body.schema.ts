import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const pageBodySchema = z.strictObject({
  children: childrenSchema,
});
