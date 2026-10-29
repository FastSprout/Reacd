import { z } from 'zod';
import { timelineContentSchema } from './timeline.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { labelSchema } from '../shared/values.js';

export const timelineNodeSchema = timelineContentSchema
  .extend({
    type: z.literal('Timeline'),
    value: z.union([labelSchema, writeStateBindingSchema]).optional(),
  })
  .refine(
    (node) =>
      typeof node.value !== 'string' ||
      node.items.some((item) => item.id === node.value),
    'Timeline value must identify an event.',
  );
