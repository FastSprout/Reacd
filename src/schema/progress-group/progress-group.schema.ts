import { z } from 'zod';
import { BUTTON_INTENTS, CONTENT_POLICY } from '../../core/policy.js';
import { PROGRESS_GROUP_POLICY } from '../../core/progress-group-policy.js';
import { labelSchema } from '../shared/values.js';

export const progressGroupItemSchema = z.strictObject({
  id: labelSchema.max(CONTENT_POLICY.maxIdentifierLength),
  label: labelSchema,
  value: z
    .number()
    .finite()
    .min(-PROGRESS_GROUP_POLICY.maxMagnitude)
    .max(PROGRESS_GROUP_POLICY.maxMagnitude),
  intent: z.enum(BUTTON_INTENTS).optional(),
});
export const progressGroupSchema = z.strictObject({
  label: labelSchema,
  items: z
    .array(progressGroupItemSchema)
    .min(1)
    .max(PROGRESS_GROUP_POLICY.maxItems)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'ProgressGroup item identifiers must be unique.',
    ),
  max: z
    .number()
    .finite()
    .positive()
    .max(PROGRESS_GROUP_POLICY.maxMagnitude)
    .optional(),
  showStatus: z.boolean().optional(),
});
