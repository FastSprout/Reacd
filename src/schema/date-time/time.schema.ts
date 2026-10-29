import { z } from 'zod';
import {
  isIsoTime,
  orderedTemporalLimits,
  withinTemporalLimits,
} from '../../core/date-time.js';
import { temporalRangeSchema } from './range.schema.js';
import { DATE_TIME_POLICY } from '../../core/date-time-policy.js';

export const isoTimeSchema = z
  .string()
  .length(DATE_TIME_POLICY.timeLength)
  .regex(DATE_TIME_POLICY.timePattern)
  .refine(isIsoTime, 'Expected a canonical local time in HH:mm:ss format.');
export const timeValueSchema = isoTimeSchema.nullable();
export const timeLimitsSchema = z
  .strictObject({ min: isoTimeSchema.optional(), max: isoTimeSchema.optional() })
  .refine(orderedTemporalLimits, 'Time limits must be ordered.')
  .readonly();
export type TimeLimits = z.input<typeof timeLimitsSchema>;

export function boundedTimeValueSchema(limits: TimeLimits = {}) {
  const parsed = timeLimitsSchema.parse(limits);
  return timeValueSchema.refine(
    (value) => withinTemporalLimits(value, parsed),
    'Time must be empty or within its inclusive limits.',
  );
}

export function timeRangeValueSchema(limits: TimeLimits = {}) {
  return temporalRangeSchema(boundedTimeValueSchema(limits));
}
