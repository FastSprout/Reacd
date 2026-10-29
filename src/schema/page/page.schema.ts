import { identifierSchema } from '../shared/identifier.js';
import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const pageSchema = z.strictObject({
  anchor: identifierSchema.optional(),
  children: childrenSchema,
  left: childrenSchema,
  right: childrenSchema,
  title: labelSchema,
  subtitle: textSchema.optional(),
});
