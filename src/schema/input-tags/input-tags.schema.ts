import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { INPUT_TAGS_POLICY, TAG_DELIMITERS } from '../../core/input-tags-policy.js';
import { tagValidationMessage } from '../../core/tag-entry.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { rowIdSchema, stateKeySchema } from '../state/shared/definition.js';

const tagSequenceSchema = z
  .array(rowIdSchema)
  .max(INPUT_TAGS_POLICY.maxTags)
  .readonly();
export function tagsValueSchema(
  maxTags: number = INPUT_TAGS_POLICY.maxTags,
  maxTagLength: number = INPUT_TAGS_POLICY.maxTagLength,
) {
  return tagSequenceSchema.refine(
    (value) => tagValidationMessage(value, { maxTags, maxTagLength }) === undefined,
    'Invalid tag collection.',
  );
}
const delimitersSchema = z
  .array(z.enum(TAG_DELIMITERS))
  .min(INPUT_TAGS_POLICY.minTagsLimit)
  .max(TAG_DELIMITERS.length)
  .refine(
    (values) => new Set(values).size === values.length,
    'Tag delimiters must be unique.',
  )
  .readonly();
export const inputTagsSchema = z
  .strictObject({
    label: labelSchema,
    description: textSchema.optional(),
    value: tagSequenceSchema,
    onValueChange: z.custom<(value: readonly string[]) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
    placeholder: textSchema.optional(),
    maxTags: z
      .number()
      .int()
      .min(INPUT_TAGS_POLICY.minTagsLimit)
      .max(INPUT_TAGS_POLICY.maxTags)
      .optional(),
    maxTagLength: z
      .number()
      .int()
      .min(INPUT_TAGS_POLICY.minTagLength)
      .max(INPUT_TAGS_POLICY.maxTagLength)
      .optional(),
    delimiters: delimitersSchema.optional(),
    addOnPaste: z.boolean().optional(),
    addOnTab: z.boolean().optional(),
    addOnBlur: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    required: z.boolean().optional(),
    name: stateKeySchema.optional(),
  })
  .refine(
    (props) =>
      tagsValueSchema(props.maxTags, props.maxTagLength).safeParse(props.value).success,
    'Invalid tag collection.',
  );
