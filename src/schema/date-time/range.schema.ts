import { z } from 'zod';
import { orderedTemporalRange } from '../../core/date-time.js';

export function temporalRangeSchema(endpoint: z.ZodType<string | null>) {
  return z
    .strictObject({ start: endpoint, end: endpoint })
    .refine(orderedTemporalRange, 'Range endpoints must be ordered when complete.')
    .readonly();
}
