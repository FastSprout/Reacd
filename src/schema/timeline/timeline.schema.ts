import { z } from 'zod';
import { BUTTON_INTENTS, CONTENT_POLICY } from '../../core/policy.js';
import { TIMELINE_ORIENTATIONS, TIMELINE_POLICY } from '../../core/timeline-policy.js';
import { labelSchema, textSchema, textChangeSchema } from '../shared/values.js';

export const timelineItemSchema = z.strictObject({
  id: labelSchema.max(CONTENT_POLICY.maxIdentifierLength),
  title: labelSchema,
  description: textSchema.optional(),
  date: labelSchema.optional(),
  disabled: z.boolean().optional(),
});
export const timelineContentSchema = z.strictObject({
  label: labelSchema,
  items: z
    .array(timelineItemSchema)
    .min(1)
    .max(TIMELINE_POLICY.maxItems)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Timeline identifiers must be unique.',
    ),
  intent: z.enum(BUTTON_INTENTS).optional(),
  orientation: z.enum(TIMELINE_ORIENTATIONS).optional(),
  reverse: z.boolean().optional(),
});
export const timelineSchema = timelineContentSchema
  .extend({
    value: labelSchema.optional(),
    onValueChange: textChangeSchema.optional(),
  })
  .refine(
    (props) =>
      props.value === undefined || props.items.some((item) => item.id === props.value),
    'Timeline value must identify an event.',
  );
