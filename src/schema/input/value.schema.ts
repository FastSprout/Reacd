import { z } from 'zod';
import type { InputType } from '../../core/policy.js';
import { INPUT_PATTERNS, INPUT_POLICY } from '../../core/input-policy.js';
import { textSchema } from '../shared/values.js';
import { inputLengthSchema } from './properties.schema.js';

export const inputTextSchema = textSchema.regex(INPUT_PATTERNS.singleLine);

export function inputValueSchema(
  maxLength: number = INPUT_POLICY.maximumLength,
  inputType: InputType = INPUT_POLICY.defaultType,
) {
  return inputTextSchema
    .max(inputLengthSchema.parse(maxLength))
    .refine(
      (value) =>
        inputType !== 'email' || !INPUT_PATTERNS.emailEdgeWhitespace.test(value),
      'Email values cannot contain edge ASCII whitespace.',
    );
}

export const inputEmailSchema = textSchema.regex(z.regexes.html5Email);
