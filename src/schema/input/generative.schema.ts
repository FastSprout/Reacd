import { z } from 'zod';
import { stateBindingSchema } from '../state/binding.schema.js';
import { inputPropertiesSchema, validInputLengths } from './properties.schema.js';

export const inputNodeSchema = inputPropertiesSchema
  .extend({
    type: z.literal('Input'),
    value: stateBindingSchema,
  })
  .refine(validInputLengths, 'Minimum length cannot exceed maximum length.');
