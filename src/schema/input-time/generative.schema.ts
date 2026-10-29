import { z } from 'zod';
import { orderedTemporalLimits } from '../../core/date-time.js';
import { INPUT_TIME_POLICY } from '../../core/input-time-policy.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { inputTimeProperties } from './properties.schema.js';

export const inputTimeNodeSchema = z
  .strictObject({
    ...inputTimeProperties,
    type: z.literal('InputTime'),
    mode: z.enum(['single', 'range']).optional(),
    value: stateBindingSchema,
  })
  .refine(orderedTemporalLimits, INPUT_TIME_POLICY.invalidValue);
