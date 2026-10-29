import { z } from 'zod';
import { PIN_INPUT_POLICY, PIN_INPUT_TYPES } from '../../core/pin-input-policy.js';
import { labelSchema, textChangeSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const pinLengthSchema = z
  .number()
  .int()
  .min(PIN_INPUT_POLICY.minLength)
  .max(PIN_INPUT_POLICY.maxLength);

export function pinValueSchema(
  length: number = PIN_INPUT_POLICY.length,
  inputType: (typeof PIN_INPUT_TYPES)[number] = PIN_INPUT_POLICY.inputType,
) {
  const pattern =
    inputType === 'numeric'
      ? PIN_INPUT_POLICY.numericPattern
      : PIN_INPUT_POLICY.alphanumericPattern;
  return z.string().max(length).regex(new RegExp(pattern));
}

export const pinInputSchema = z
  .strictObject({
    label: labelSchema,
    description: textSchema.optional(),
    value: textSchema,
    onValueChange: textChangeSchema,
    onComplete: textChangeSchema.optional(),
    length: pinLengthSchema.optional(),
    inputType: z.enum(PIN_INPUT_TYPES).optional(),
    separatorEvery: pinLengthSchema.optional(),
    mask: z.boolean().optional(),
    otp: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    required: z.boolean().optional(),
    name: stateKeySchema.optional(),
  })
  .refine((props) => {
    const length = props.length ?? PIN_INPUT_POLICY.length;
    return (
      pinValueSchema(length, props.inputType).safeParse(props.value).success &&
      (props.separatorEvery === undefined || props.separatorEvery < length)
    );
  }, 'Invalid PIN value or grouping.');
