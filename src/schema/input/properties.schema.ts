import { z } from 'zod';
import { INPUT_TYPES } from '../../core/policy.js';
import { INPUT_AUTOFILL, INPUT_POLICY } from '../../core/input-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const inputLengthSchema = z
  .number()
  .int()
  .min(INPUT_POLICY.minimumLength)
  .max(INPUT_POLICY.maximumLength);

export const inputPropertiesSchema = z.strictObject({
  label: labelSchema,
  inputType: z.enum(INPUT_TYPES).optional(),
  placeholder: textSchema.optional(),
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  loading: z.boolean().optional(),
  minLength: inputLengthSchema.optional(),
  maxLength: inputLengthSchema.optional(),
  autoComplete: z.enum(INPUT_AUTOFILL).optional(),
});

export function validInputLengths(properties: {
  readonly minLength?: number | undefined;
  readonly maxLength?: number | undefined;
}): boolean {
  return (
    (properties.minLength ?? INPUT_POLICY.minimumLength) <=
    (properties.maxLength ?? INPUT_POLICY.maximumLength)
  );
}
