import { z } from 'zod';
import {
  textareaPropertiesSchema,
  validTextareaSettings,
} from './properties.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

export const textareaNodeSchema = textareaPropertiesSchema
  .extend({
    type: z.literal('Textarea'),
    value: stateBindingSchema,
  })
  .refine(validTextareaSettings, 'Textarea row and length limits must be ordered.');
