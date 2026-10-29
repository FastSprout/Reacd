import { z } from 'zod';
import { labelSchema, textChangeSchema } from '../shared/values.js';
import { containsSelection, optionsSchema } from '../shared/options.js';

export const navigationSchema = z
  .strictObject({
    label: labelSchema,
    value: labelSchema,
    items: optionsSchema,
    onValueChange: textChangeSchema,
  })
  .refine(containsSelection, 'Selected destination must exist in the options.');
