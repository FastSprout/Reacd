import { z } from 'zod';
import { staticTableContentSchema, validStaticTable } from './table.schema.js';
import { interactiveTableSchema } from './interactive.schema.js';
import { dataTableColumnsSchema } from '../data-table/columns.schema.js';
import { dataTableBindingsSchema } from '../data-table/bindings.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
export const staticTableNodeSchema = staticTableContentSchema
  .extend({
    type: z.literal('Table'),
    retryAction: stateKeySchema.optional(),
  })
  .refine(validStaticTable, 'Each row must have one cell per column.');
const {
  model: _model,
  onModelChange: _change,
  onRetry: _retry,
  editable: _editable,
  ...interactiveShape
} = interactiveTableSchema.shape;
export const interactiveTableNodeSchema = z.strictObject({
  ...interactiveShape,
  type: z.literal('Table'),
  columns: dataTableColumnsSchema,
  bindings: dataTableBindingsSchema,
  retryAction: stateKeySchema.optional(),
});
export type InteractiveTableNode = z.infer<typeof interactiveTableNodeSchema>;
export const tableNodeSchema = z.discriminatedUnion('mode', [
  staticTableNodeSchema,
  interactiveTableNodeSchema,
]);
