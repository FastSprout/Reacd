import { z } from 'zod';
import { iconNameSchema, iconSizeSchema } from './icon.schema.js';
import { labelSchema } from '../shared/values.js';

export const iconNodeSchema = z
  .strictObject({
    type: z.literal('Icon'),
    name: iconNameSchema,
    size: iconSizeSchema.optional(),
    label: labelSchema.optional(),
    decorative: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.decorative === true ? value.label === undefined : value.label !== undefined,
    'Meaningful icons require labels; decorative icons must not have labels.',
  );
