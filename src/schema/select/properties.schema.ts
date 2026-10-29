import { z } from 'zod';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { selectionOptionsSchema } from '../selection/index.js';

export const selectPropertiesSchema = z.strictObject({
  label: labelSchema,
  items: selectionOptionsSchema,
  description: textSchema.optional(),
  placeholder: textSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  loading: z.boolean().optional(),
  clearable: z.boolean().optional(),
});
