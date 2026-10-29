import { identifierSchema } from '../shared/identifier.js';
import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const sectionSchema = z.strictObject({
  anchor: identifierSchema.optional(),
  children: childrenSchema,
  title: labelSchema,
  description: textSchema.optional(),
});
