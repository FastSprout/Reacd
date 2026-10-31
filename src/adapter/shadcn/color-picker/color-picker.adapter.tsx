import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-picker/color-picker.adapter.js';
import { SharedColorPicker } from '../../shared/color-picker/color-picker.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorPickerProps = ComponentProps<typeof SharedColorPicker>;
export const ShadcnColorPicker: ComponentType<ShadcnColorPickerProps> = bindPrimitives(
  SharedColorPicker,
  shadcnPrimitives,
  'ShadcnColorPicker',
);
