import { proseIdSchema } from '../prose/values.js';
import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const pageSchema = z.strictObject({
  anchor: proseIdSchema.optional(),
  children: childrenSchema,
  left: childrenSchema,
  right: childrenSchema,
  title: labelSchema,
  subtitle: textSchema.optional(),
});
