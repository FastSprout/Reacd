import { z } from 'zod';
import { isoDateSchema, dateLocaleSchema } from '../date-time/index.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const inputDateProperties = {
  label: labelSchema,
  referenceDate: isoDateSchema,
  description: textSchema.optional(),
  locale: dateLocaleSchema.optional(),
  min: isoDateSchema.optional(),
  max: isoDateSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
};
