import { z } from 'zod';
import { ICON_NAMES, ICON_SIZES } from '../../core/icon-policy.js';
import { labelSchema } from '../shared/values.js';

export const iconNameSchema = z.enum(ICON_NAMES);
export const iconSizeSchema = z.enum(ICON_SIZES);
const shape = { name: iconNameSchema, size: iconSizeSchema.optional() };
export const iconSchema = z.union([
  z.strictObject({
    ...shape,
    label: labelSchema,
    decorative: z.literal(false).optional(),
  }),
  z.strictObject({
    ...shape,
    decorative: z.literal(true),
    label: z.never().optional(),
  }),
]);
