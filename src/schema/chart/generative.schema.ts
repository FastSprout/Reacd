import { z } from 'zod';
import { chartContentSchema, validChartData } from './chart.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
export const chartNodeSchema = chartContentSchema
  .extend({
    type: z.literal('Chart'),
    retryAction: stateKeySchema.optional(),
  })
  .refine(validChartData, 'Chart values must match unique categories and chart kind.');
