import { z } from 'zod';
import {
  isIsoDate,
  orderedTemporalLimits,
  withinTemporalLimits,
} from '../../core/date-time.js';
import { temporalRangeSchema } from './range.schema.js';
import { DATE_TIME_POLICY } from '../../core/date-time-policy.js';

export const isoDateSchema = z
  .string()
  .length(DATE_TIME_POLICY.dateLength)
  .regex(DATE_TIME_POLICY.datePattern)
  .refine(isIsoDate, 'Expected a canonical Gregorian date in YYYY-MM-DD format.');
export const dateValueSchema = isoDateSchema.nullable();
export const dateLimitsSchema = z
  .strictObject({ min: isoDateSchema.optional(), max: isoDateSchema.optional() })
  .refine(orderedTemporalLimits, 'Date limits must be ordered.')
  .readonly();
export type DateLimits = z.input<typeof dateLimitsSchema>;

export function boundedDateValueSchema(limits: DateLimits = {}) {
  const parsed = dateLimitsSchema.parse(limits);
  return dateValueSchema.refine(
    (value) => withinTemporalLimits(value, parsed),
    'Date must be empty or within its inclusive limits.',
  );
}

export function dateRangeValueSchema(limits: DateLimits = {}) {
  return temporalRangeSchema(boundedDateValueSchema(limits));
}
