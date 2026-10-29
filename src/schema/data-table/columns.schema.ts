import { z } from 'zod';
import { COLUMN_KINDS } from '../../core/data-table-policy.js';
import { STATE_POLICY } from '../../core/state-policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema } from '../shared/values.js';

export const dataTableColumnsSchema = z
  .array(
    z
      .strictObject({
        key: stateKeySchema,
        label: labelSchema,
        kind: z.enum(COLUMN_KINDS),
      })
      .readonly(),
  )
  .min(1)
  .max(STATE_POLICY.maxColumns)
  .refine(
    (columns) => new Set(columns.map((column) => column.key)).size === columns.length,
    'Table column keys must be unique.',
  )
  .readonly();
export type DataTableColumn = z.infer<typeof dataTableColumnsSchema>[number];
