import { z } from 'zod';
import { DATA_STATES } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { dataTableModelSchema } from './model.schema.js';
import { validVisibleTable } from './validate-visible-model.js';

type Model = z.infer<typeof dataTableModelSchema>;
function callback<Value>() {
  return z
    .custom<(value: Value) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    )
    .optional();
}

export const dataTableComponentSchema = dataTableModelSchema
  .extend({
    caption: labelSchema,
    totalRows: z.number().int().min(0),
    filteredRows: z.number().int().min(0),
    pageCount: z.number().int().min(1),
    state: z.enum(DATA_STATES).optional(),
    emptyMessage: textSchema.optional(),
    errorMessage: textSchema.optional(),
    onSelectionChange: callback<Model['selection']>(),
    onSortingChange: callback<Model['sorting']>(),
    onFiltersChange: callback<Model['filters']>(),
    onPaginationChange: callback<Model['pagination']>(),
  })
  .refine(validVisibleTable, 'Visible rows and counts must match the table view.');
