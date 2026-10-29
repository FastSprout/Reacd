import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import {
  CHOICE_DEFAULTS,
  CHOICE_ORIENTATIONS,
  CHOICE_POLICY,
} from '../../core/choice-policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema } from './values.js';

export const choiceItemSchema = z.strictObject({
  value: stateKeySchema,
  label: labelSchema,
  description: labelSchema.optional(),
  disabled: z.boolean().optional(),
});
export const choiceItemsSchema = z
  .array(choiceItemSchema)
  .min(CHOICE_POLICY.minItems)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (items) => new Set(items.map((item) => item.value)).size === items.length,
    'Choice item values must be unique.',
  )
  .readonly();
export const choiceValueSchema = z.union([
  z.literal(CHOICE_DEFAULTS.emptyValue),
  stateKeySchema,
]);
export const choiceSelectionSchema = z
  .array(stateKeySchema)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (value) => new Set(value).size === value.length,
    'Selected choice values must be unique.',
  )
  .readonly();
export const selectionChangeSchema = z.custom<(value: readonly string[]) => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const choiceGroupShape = {
  label: labelSchema,
  description: labelSchema.optional(),
  items: choiceItemsSchema,
  orientation: z.enum(CHOICE_ORIENTATIONS).optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  name: stateKeySchema.optional(),
};
export function validChoiceValue(items: readonly { value: string }[], value: string) {
  return (
    value === CHOICE_DEFAULTS.emptyValue || items.some((item) => item.value === value)
  );
}
export function validChoiceSelection(properties: {
  items: readonly { value: string }[];
  value: readonly string[];
  max?: number | undefined;
}) {
  return (
    properties.value.every((value) =>
      properties.items.some((item) => item.value === value),
    ) &&
    (properties.max === undefined || properties.value.length <= properties.max)
  );
}
