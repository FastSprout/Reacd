import { z } from 'zod';
import {
  MARQUEE_PACES,
  MARQUEE_DIRECTIONS,
  MARQUEE_POLICY,
} from '../../core/marquee-policy.js';
import { labelSchema, textSchema, booleanChangeSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
export const marqueeContentSchema = z.strictObject({
  label: labelSchema,
  items: z
    .array(z.strictObject({ id: stateKeySchema, label: labelSchema }))
    .max(MARQUEE_POLICY.maxItems)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Marquee item identifiers must be unique.',
    )
    .readonly(),
  direction: z.enum(MARQUEE_DIRECTIONS).optional(),
  pace: z.enum(MARQUEE_PACES).optional(),
  readOnly: z.boolean().optional(),
  emptyMessage: textSchema.optional(),
});
export const marqueeSchema = marqueeContentSchema.extend({
  paused: z.boolean(),
  onPausedChange: booleanChangeSchema,
});
