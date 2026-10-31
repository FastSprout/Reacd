import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { colorPickerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-picker/index.js';
import { MuiColorPicker } from '../color-picker/color-picker.adapter.js';
export const colorPickerEntries = {
  ColorPicker: renderEntry('ColorPicker', colorPickerSchema, MuiColorPicker),
};
