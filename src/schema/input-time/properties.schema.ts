import { z } from 'zod';
import { isoTimeSchema, dateLocaleSchema } from '../date-time/index.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const inputTimeProperties = {
  label: labelSchema,
  description: textSchema.optional(),
  locale: dateLocaleSchema.optional(),
  min: isoTimeSchema.optional(),
  max: isoTimeSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
};
