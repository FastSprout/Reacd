import { z } from 'zod';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const selectionKeySchema = z
  .string()
  .min(1)
  .max(SELECTION_POLICY.maximumValueLength)
  .refine(
    (value) => value === value.trim(),
    'Selection values cannot contain edge whitespace.',
  );

export const selectionOptionSchema = z
  .strictObject({
    value: selectionKeySchema,
    label: labelSchema,
    description: textSchema.optional(),
    disabled: z.boolean().optional(),
  })
  .readonly();

export type SelectionOption = z.infer<typeof selectionOptionSchema>;

export const selectionOptionsSchema = z
  .array(selectionOptionSchema)
  .max(SELECTION_POLICY.maximumOptions)
  .refine(
    (items) => new Set(items.map((item) => item.value)).size === items.length,
    'Selection values must be unique.',
  )
  .readonly();
