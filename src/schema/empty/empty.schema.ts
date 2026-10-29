import { z } from 'zod';
import { EMPTY_SIZES, EMPTY_VARIANTS } from '../../core/empty-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const emptySchema = z.strictObject({
  title: labelSchema,
  description: textSchema.optional(),
  size: z.enum(EMPTY_SIZES).optional(),
  variant: z.enum(EMPTY_VARIANTS).optional(),
  loading: z.boolean().optional(),
  loadingLabel: labelSchema.optional(),
  leading: childrenSchema,
  children: childrenSchema,
  actions: childrenSchema,
  footer: childrenSchema,
});
