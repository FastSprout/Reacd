import { z } from 'zod';
import { orderedTemporalLimits } from '../../core/date-time.js';
import { calendarSettingsSchema } from './calendar.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

export const calendarNodeSchema = z
  .strictObject({
    ...calendarSettingsSchema.shape,
    type: z.literal('Calendar'),
    mode: z.enum(['single', 'range']).optional(),
    value: stateBindingSchema,
  })
  .refine(orderedTemporalLimits, 'Calendar limits must be ordered.');

export type CalendarNodeDeclaration = z.infer<typeof calendarNodeSchema>;
