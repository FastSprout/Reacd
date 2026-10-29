import { z } from 'zod';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';

export const dataTableBindingsSchema = z
  .strictObject({
    rows: readStateBindingSchema,
    selection: stateBindingSchema,
    sorting: stateBindingSchema,
    filters: stateBindingSchema,
    pagination: stateBindingSchema,
  })
  .refine(
    (bindings) =>
      new Set(Object.values(bindings).map((binding) => binding.state)).size ===
      Object.keys(bindings).length,
    'Table bindings require distinct state keys.',
  )
  .refine(
    (bindings) =>
      bindings.pagination.mode === 'readWrite' ||
      (bindings.sorting.mode === 'read' && bindings.filters.mode === 'read'),
    'Editable sorting and filtering require writable pagination.',
  )
  .readonly();
export type DataTableBindings = z.infer<typeof dataTableBindingsSchema>;
