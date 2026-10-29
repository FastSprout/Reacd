import { z } from 'zod';
import { DATA_STATES } from '../../core/policy.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { dataTableColumnsSchema } from './columns.schema.js';
import { dataTableBindingsSchema } from './bindings.schema.js';

export const dataTableNodeSchema = z.strictObject({
  type: z.literal('DataTable'),
  caption: labelSchema,
  columns: dataTableColumnsSchema,
  bindings: dataTableBindingsSchema,
  state: z.enum(DATA_STATES).optional(),
  emptyMessage: textSchema.optional(),
  errorMessage: textSchema.optional(),
});
