import { z } from 'zod';
import { BUTTON_INTENTS } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';
import { iconNameSchema, iconSizeSchema } from '../icon/index.js';

export const badgeSchema = z.strictObject({
  label: labelSchema,
  intent: z.enum(BUTTON_INTENTS).optional(),
  leadingIcon: iconNameSchema.optional(),
  size: iconSizeSchema.optional(),
});
