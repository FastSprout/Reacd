import { z } from 'zod';
import { CONTENT_POLICY, DATA_STATES } from '../../core/policy.js';
import { labelSchema, textSchema, pressSchema } from '../shared/values.js';
import { interactiveTableSchema } from './interactive.schema.js';

export const tableComponentSchema = z
  .strictObject({
    caption: labelSchema,
    columns: z.array(labelSchema).min(1).max(CONTENT_POLICY.maxTableColumns),
    rows: z
      .array(z.array(textSchema).max(CONTENT_POLICY.maxTableColumns))
      .max(CONTENT_POLICY.maxTableRows),
    state: z.enum(DATA_STATES).optional(),
    emptyMessage: textSchema.optional(),
    errorMessage: textSchema.optional(),
  })
  .refine(
    (props) => props.rows.every((row) => row.length === props.columns.length),
    'Each row must have one cell per column.',
  );

export const staticTableContentSchema = z.strictObject({
  ...tableComponentSchema.shape,
  mode: z.literal('static').optional(),
  loadingMessage: textSchema.optional(),
  retryLabel: labelSchema.optional(),
});
export function validStaticTable(value: z.infer<typeof staticTableContentSchema>) {
  return value.rows.every((row) => row.length === value.columns.length);
}
export const staticTableSchema = staticTableContentSchema
  .extend({
    onRetry: pressSchema.optional(),
  })
  .refine(validStaticTable, 'Each row must have one cell per column.');
export const tableDeclarationSchema = z.union([
  staticTableSchema,
  interactiveTableSchema,
]);
