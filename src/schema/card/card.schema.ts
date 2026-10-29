import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, spacingSchema } from '../shared/values.js';

export const cardSchema = z.strictObject({
  children: childrenSchema,
  spacing: spacingSchema,
  label: labelSchema.optional(),
  header: childrenSchema,
  footer: childrenSchema,
});
