import { z } from 'zod';
import { stateBindingSchema } from '../state/binding.schema.js';
import {
  colorPickerPropertiesSchema,
  validColorPresets,
} from './color-picker.schema.js';
export const colorPickerNodeSchema = colorPickerPropertiesSchema
  .extend({
    type: z.literal('ColorPicker'),
    value: stateBindingSchema,
  })
  .refine(validColorPresets, 'Preset values must be unique and match the color mode.');
