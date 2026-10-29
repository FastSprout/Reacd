import { z } from 'zod';
import { KBD_PLATFORMS, KBD_SIZES, KBD_VARIANTS } from '../../core/kbd-policy.js';
import { BUTTON_INTENTS } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';
export const kbdSchema = z.strictObject({
  value: labelSchema,
  label: labelSchema.optional(),
  platform: z.enum(KBD_PLATFORMS).optional(),
  size: z.enum(KBD_SIZES).optional(),
  variant: z.enum(KBD_VARIANTS).optional(),
  intent: z.enum(BUTTON_INTENTS).optional(),
});
