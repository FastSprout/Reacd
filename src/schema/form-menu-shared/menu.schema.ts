import { z } from 'zod';
import { DATA_STATES } from '../../core/policy.js';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import { selectionOptionsSchema, selectionKeySchema } from '../selection/index.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const menuItemsSchema = selectionOptionsSchema;
export const menuVisibleSchema = z
  .array(selectionKeySchema)
  .max(SELECTION_POLICY.maximumOptions)
  .refine(
    (values) => new Set(values).size === values.length,
    'Visible suggestion values must be unique.',
  )
  .readonly();
export const menuTextChangeSchema = z.custom<(value: string) => boolean | void>(
  (value) => typeof value === 'function',
  'Text change must be a function.',
);
export const menuOpenChangeSchema = z.custom<(value: boolean) => boolean | void>(
  (value) => typeof value === 'function',
  'Open change must be a function.',
);
export const menuShape = {
  label: labelSchema,
  description: textSchema.optional(),
  items: menuItemsSchema,
  visibleValues: menuVisibleSchema.optional(),
  placeholder: textSchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  required: z.boolean().optional(),
  name: stateKeySchema.optional(),
  clearable: z.boolean().optional(),
  status: z.enum(DATA_STATES).optional(),
  emptyMessage: labelSchema.optional(),
  loadingMessage: labelSchema.optional(),
  errorMessage: labelSchema.optional(),
};

export function validVisibleMenu(properties: {
  items: readonly { value: string }[];
  visibleValues?: readonly string[] | undefined;
}) {
  return (
    properties.visibleValues === undefined ||
    properties.visibleValues.every((value) =>
      properties.items.some((item) => item.value === value),
    )
  );
}
