import { z } from 'zod';
import { orderedTemporalLimits } from '../../core/date-time.js';
import { INPUT_DATE_POLICY } from '../../core/input-date-policy.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { inputDateProperties } from './properties.schema.js';

export const inputDateNodeSchema = z
  .strictObject({
    ...inputDateProperties,
    type: z.literal('InputDate'),
    mode: z.enum(['single', 'range']).optional(),
    value: stateBindingSchema,
  })
  .refine(orderedTemporalLimits, INPUT_DATE_POLICY.invalidValue);
