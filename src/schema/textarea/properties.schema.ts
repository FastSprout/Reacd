import { z } from 'zod';
import { TEXTAREA_POLICY } from '../../core/textarea-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const textareaLengthSchema = z
  .number()
  .int()
  .min(TEXTAREA_POLICY.minimumLength)
  .max(TEXTAREA_POLICY.maximumLength);
const rowsSchema = z
  .number()
  .int()
  .min(TEXTAREA_POLICY.minimumRows)
  .max(TEXTAREA_POLICY.maximumRows);

export const textareaPropertiesSchema = z.strictObject({
  label: labelSchema,
  description: textSchema.optional(),
  placeholder: textSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  minLength: textareaLengthSchema.optional(),
  maxLength: textareaLengthSchema.optional(),
  rows: rowsSchema.optional(),
  maxRows: rowsSchema.optional(),
  autoResize: z.boolean().optional(),
});

export function validTextareaSettings(props: z.infer<typeof textareaPropertiesSchema>) {
  return (
    (props.rows ?? TEXTAREA_POLICY.defaultRows) <=
      (props.maxRows ?? TEXTAREA_POLICY.defaultMaxRows) &&
    (props.minLength ?? TEXTAREA_POLICY.minimumLength) <=
      (props.maxLength ?? TEXTAREA_POLICY.maximumLength)
  );
}
