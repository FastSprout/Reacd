import { z } from 'zod';
import {
  COLOR_MODES,
  COLOR_PICKER_POLICY as P,
} from '../../core/color-picker-policy.js';
import { labelSchema, textSchema, textChangeSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
export type ColorMode = (typeof COLOR_MODES)[number];
export function colorValueSchema(mode: ColorMode) {
  return z
    .string()
    .length(mode === 'rgb' ? P.rgbLength : P.rgbaLength)
    .regex(/^#[0-9a-f]+(?![\s\S])/u);
}
const presetSchema = z
  .strictObject({
    label: labelSchema,
    value: z.string().max(P.rgbaLength),
  })
  .readonly();
export const colorPickerPropertiesSchema = z.strictObject({
  mode: z.enum(COLOR_MODES),
  label: labelSchema,
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  presets: z.array(presetSchema).max(P.maxPresets).readonly().optional(),
});
export function validColorPresets(props: z.infer<typeof colorPickerPropertiesSchema>) {
  const presets = props.presets ?? [];
  const schema = colorValueSchema(props.mode);
  return (
    new Set(presets.map((preset) => preset.value)).size === presets.length &&
    presets.every((preset) => schema.safeParse(preset.value).success)
  );
}
export const colorPickerSchema = colorPickerPropertiesSchema
  .extend({
    value: z.string().max(P.rgbaLength),
    onValueChange: textChangeSchema,
  })
  .refine(validColorPresets, 'Preset values must be unique and match the color mode.')
  .refine(
    (props) => colorValueSchema(props.mode).safeParse(props.value).success,
    'Color values must match the canonical lowercase color mode.',
  );
