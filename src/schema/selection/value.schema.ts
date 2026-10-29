import { z } from 'zod';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import { selectionKeySchema, selectionOptionsSchema } from './options.schema.js';
import type { SelectionOption } from './options.schema.js';

export function singleSelectionValueSchema(items: readonly SelectionOption[]) {
  const allowed = new Set(
    selectionOptionsSchema.parse(items).map((item) => item.value),
  );
  return z
    .union([z.literal(SELECTION_POLICY.emptySingleValue), selectionKeySchema])
    .refine(
      (value) => value === SELECTION_POLICY.emptySingleValue || allowed.has(value),
      'Selected value must exist in the options.',
    );
}

export function multipleSelectionValueSchema(items: readonly SelectionOption[]) {
  const allowed = new Set(
    selectionOptionsSchema.parse(items).map((item) => item.value),
  );
  return z
    .array(selectionKeySchema)
    .max(SELECTION_POLICY.maximumOptions)
    .refine(
      (values) =>
        new Set(values).size === values.length &&
        values.every((value) => allowed.has(value)),
      'Selected values must be unique options.',
    )
    .readonly();
}
