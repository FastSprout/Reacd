import { z } from 'zod';
import { CALENDAR_POLICY } from '../../core/calendar-policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { orderedTemporalLimits, withinTemporalLimits } from '../../core/date-time.js';
import type { TemporalRange } from '../../core/date-time.js';
import {
  isoDateSchema,
  dateValueSchema,
  dateRangeValueSchema,
  dateLocaleSchema,
} from '../date-time/index.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const calendarSettingsSchema = z.strictObject({
  label: labelSchema,
  referenceDate: isoDateSchema,
  description: textSchema.optional(),
  locale: dateLocaleSchema.optional(),
  min: isoDateSchema.optional(),
  max: isoDateSchema.optional(),
  numberOfMonths: z
    .number()
    .int()
    .min(CALENDAR_POLICY.minimumMonths)
    .max(CALENDAR_POLICY.maximumMonths)
    .optional(),
  weekStartsOn: z
    .union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ])
    .optional(),
  name: stateKeySchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  required: z.boolean().optional(),
});

export const calendarSingleSchema = calendarSettingsSchema.extend({
  mode: z.literal('single').optional(),
  value: dateValueSchema,
  onValueChange: z.custom<(value: string | null) => void>(
    (value) => typeof value === 'function',
    FRAMEWORK_ERRORS.invalidCallback,
  ),
});
export const calendarRangeSchema = calendarSettingsSchema.extend({
  mode: z.literal('range'),
  value: dateRangeValueSchema(),
  onValueChange: z.custom<(value: TemporalRange) => void>(
    (value) => typeof value === 'function',
    FRAMEWORK_ERRORS.invalidCallback,
  ),
});

export const calendarSchema = z
  .union([calendarSingleSchema, calendarRangeSchema])
  .refine((properties) => {
    if (!orderedTemporalLimits(properties)) return false;
    return properties.mode === 'range'
      ? withinTemporalLimits(properties.value.start, properties) &&
          withinTemporalLimits(properties.value.end, properties)
      : withinTemporalLimits(properties.value, properties);
  }, 'Calendar values must satisfy ordered inclusive limits.');
