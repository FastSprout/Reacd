import { z } from 'zod';
import { DATA_STATES } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema, textSchema, pressSchema } from '../shared/values.js';
import { dataTableModelSchema } from '../data-table/model.schema.js';
import type { DataTableModel } from '../data-table/model.schema.js';
import { validateTableModel } from '../data-table/validate-model.js';
export const tableEditableSchema = z
  .strictObject({
    selection: z.boolean(),
    sorting: z.boolean(),
    filters: z.boolean(),
    pagination: z.boolean(),
  })
  .refine(
    (value) => value.pagination || (!value.sorting && !value.filters),
    'Editable sorting and filtering require editable pagination.',
  );
export const interactiveTableSchema = z
  .strictObject({
    mode: z.literal('interactive'),
    caption: labelSchema,
    model: dataTableModelSchema,
    onModelChange: z
      .custom<(model: DataTableModel) => void>(
        (value) => typeof value === 'function',
        FRAMEWORK_ERRORS.invalidCallback,
      )
      .optional(),
    editable: tableEditableSchema.optional(),
    readOnly: z.boolean().optional(),
    disabled: z.boolean().optional(),
    state: z.enum(DATA_STATES).optional(),
    emptyMessage: textSchema.optional(),
    loadingMessage: textSchema.optional(),
    errorMessage: textSchema.optional(),
    retryLabel: labelSchema.optional(),
    onRetry: pressSchema.optional(),
  })
  .refine(
    (value) => validateTableModel(value.model).success,
    'Interactive Table requires a valid complete model.',
  );
