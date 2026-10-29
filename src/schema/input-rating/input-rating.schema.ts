import { z } from 'zod';
import { INPUT_RATING_POLICY, RATING_STEPS } from '../../core/input-rating-policy.js';
import { labelSchema, numberChangeSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const ratingLengthSchema = z
  .number()
  .int()
  .min(INPUT_RATING_POLICY.minLength)
  .max(INPUT_RATING_POLICY.maxLength);
export const ratingStepSchema = z.literal(RATING_STEPS);
export function ratingValueSchema(
  length: number = INPUT_RATING_POLICY.length,
  step: number = INPUT_RATING_POLICY.step,
) {
  return z
    .number()
    .finite()
    .min(INPUT_RATING_POLICY.emptyValue)
    .max(length)
    .multipleOf(step);
}
export const inputRatingSchema = z
  .strictObject({
    label: labelSchema,
    description: textSchema.optional(),
    value: z.number().finite(),
    onValueChange: numberChangeSchema,
    length: ratingLengthSchema.optional(),
    step: ratingStepSchema.optional(),
    clearable: z.boolean().optional(),
    hoverable: z.boolean().optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    name: stateKeySchema.optional(),
  })
  .refine(
    (props) =>
      ratingValueSchema(props.length, props.step).safeParse(props.value).success,
    'Invalid rating value.',
  );
