import { z } from 'zod';
import { STATE_POLICY } from '../../../core/state-policy.js';
import {
  rowIdSchema,
  scalarSchema,
  stateDefinitionShape,
  stateKeySchema,
} from '../shared/definition.js';

const cellsSchema = z
  .record(stateKeySchema, scalarSchema)
  .refine(
    (cells) => Object.keys(cells).length <= STATE_POLICY.maxColumns,
    'Too many table columns.',
  )
  .readonly();
const rowSchema = z.strictObject({ id: rowIdSchema, cells: cellsSchema }).readonly();

export const tableRowsValueSchema = z
  .array(rowSchema)
  .max(STATE_POLICY.maxRows)
  .refine(
    (rows) => new Set(rows.map((row) => row.id)).size === rows.length,
    'Table row IDs must be unique.',
  )
  .readonly();
export const tableRowsStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('tableRows'),
    initial: tableRowsValueSchema,
  })
  .readonly();
