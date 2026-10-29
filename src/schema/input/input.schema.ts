import { INPUT_PATTERNS, INPUT_POLICY } from '../../core/input-policy.js';
import { textChangeSchema } from '../shared/values.js';
import { inputPropertiesSchema, validInputLengths } from './properties.schema.js';
import { inputTextSchema } from './value.schema.js';

export const inputComponentSchema = inputPropertiesSchema
  .extend({
    value: inputTextSchema,
    onValueChange: textChangeSchema,
  })
  .refine(validInputLengths, 'Minimum length cannot exceed maximum length.')
  .refine(
    (properties) =>
      properties.value.length <= (properties.maxLength ?? INPUT_POLICY.maximumLength),
    'Input value cannot exceed its maximum length.',
  )
  .refine(
    (properties) =>
      properties.inputType !== 'email' ||
      !INPUT_PATTERNS.emailEdgeWhitespace.test(properties.value),
    'Email values cannot contain edge ASCII whitespace.',
  );
