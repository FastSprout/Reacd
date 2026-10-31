import type { ComponentProps, ComponentType } from 'react';
import { SharedColorPicker } from '../../shared/color-picker/color-picker.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorPickerProps = ComponentProps<typeof SharedColorPicker>;
export const MuiColorPicker: ComponentType<MuiColorPickerProps> = bindPrimitives(
  SharedColorPicker,
  muiPrimitives,
  'MuiColorPicker',
);
