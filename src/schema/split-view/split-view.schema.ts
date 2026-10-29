import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { spacingSchema } from '../shared/values.js';

export const splitViewSchema = z.strictObject({
  children: childrenSchema,
  spacing: spacingSchema,
});
