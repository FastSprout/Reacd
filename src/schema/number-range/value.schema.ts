import { z } from 'zod';
import { isOrderedNumberRange } from '../../core/number-range.js';
import type { NumberRangeBounds } from '../../core/number-range.js';
import { NUMBER_RANGE_POLICY } from '../../core/number-range-policy.js';

const boundsSchema = z
  .strictObject({
    min: z.number().finite().optional(),
    max: z.number().finite().optional(),
  })
  .refine(
    (bounds) =>
      bounds.min === undefined || bounds.max === undefined || bounds.min <= bounds.max,
    NUMBER_RANGE_POLICY.boundsMessage,
  );

export function boundedNumberRangeSchema(options: NumberRangeBounds = {}) {
  const bounds = boundsSchema.parse(options);
  let endpoint = z.number().finite();
  if (bounds.min !== undefined) endpoint = endpoint.min(bounds.min);
  if (bounds.max !== undefined) endpoint = endpoint.max(bounds.max);
  return z
    .strictObject({ start: endpoint, end: endpoint })
    .refine(isOrderedNumberRange, NUMBER_RANGE_POLICY.reversedMessage)
    .readonly();
}

export const numberRangeSchema = boundedNumberRangeSchema();
