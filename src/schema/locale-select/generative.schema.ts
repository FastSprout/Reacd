import { z } from 'zod';
import { localeSelectProperties } from './locale-select.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

export const localeSelectNodeSchema = z.strictObject({
  ...localeSelectProperties,
  type: z.literal('LocaleSelect'),
  value: stateBindingSchema,
});
