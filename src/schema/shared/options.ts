import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { labelSchema } from './values.js';

const optionSchema = z.strictObject({
  value: labelSchema,
  label: labelSchema,
});

export const optionsSchema = z
  .array(optionSchema)
  .min(1)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (items) => new Set(items.map((item) => item.value)).size === items.length,
    'Option values must be unique.',
  );

export function containsSelection(properties: {
  items: readonly z.infer<typeof optionSchema>[];
  value: string;
}): boolean {
  return properties.items.some((item) => item.value === properties.value);
}
