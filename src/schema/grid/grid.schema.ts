import { z } from 'zod';
import { LAYOUT_POLICY } from '../../core/policy.js';
import { childrenSchema } from '../shared/children.js';
import { spacingSchema } from '../shared/values.js';

export const gridSchema = z.strictObject({
  children: childrenSchema,
  spacing: spacingSchema,
  columns: z
    .number()
    .int()
    .min(LAYOUT_POLICY.minGridColumns)
    .max(LAYOUT_POLICY.maxGridColumns),
});
