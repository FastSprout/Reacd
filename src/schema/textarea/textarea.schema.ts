import { TEXTAREA_POLICY } from '../../core/textarea-policy.js';
import { textSchema, textChangeSchema } from '../shared/values.js';
import {
  textareaPropertiesSchema,
  textareaLengthSchema,
  validTextareaSettings,
} from './properties.schema.js';

export function textareaValueSchema(maxLength: number = TEXTAREA_POLICY.maximumLength) {
  return textSchema.max(textareaLengthSchema.parse(maxLength));
}

export const textareaSchema = textareaPropertiesSchema
  .extend({
    value: textSchema,
    onValueChange: textChangeSchema,
  })
  .refine(validTextareaSettings, 'Textarea row and length limits must be ordered.')
  .refine(
    (props) => props.value.length <= (props.maxLength ?? TEXTAREA_POLICY.maximumLength),
    'Textarea value exceeds its maximum length.',
  );
