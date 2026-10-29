import { z } from 'zod';
import { labelSchema, textSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';

export const contentNeighborSchema = z.strictObject({
  title: labelSchema,
  href: linkSchema.shape.href,
  description: textSchema.optional(),
  newWindow: z.boolean().optional(),
});

export const contentSurroundSchema = z.strictObject({
  label: labelSchema.optional(),
  emptyLabel: labelSchema.optional(),
  previous: contentNeighborSchema.optional(),
  next: contentNeighborSchema.optional(),
});
