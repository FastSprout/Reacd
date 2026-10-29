import { z } from 'zod';
import { ALERT_INTENTS } from '../../core/policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema, booleanChangeSchema } from '../shared/values.js';

export const bannerSchema = z.strictObject({
  title: labelSchema,
  description: textSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  dismissible: z.boolean().optional(),
  closeLabel: labelSchema.optional(),
  intent: z.enum(ALERT_INTENTS).optional(),
  actions: childrenSchema,
});
