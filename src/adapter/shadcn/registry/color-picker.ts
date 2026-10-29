import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { colorPickerSchema } from '../../../schema/color-picker/index.js';
import { ShadcnColorPicker } from '../color-picker/color-picker.adapter.js';
export const colorPickerEntries = {
  ColorPicker: renderEntry('ColorPicker', colorPickerSchema, ShadcnColorPicker),
};
