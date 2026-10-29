import type { ReactNode } from 'react';
import type { ColorPickerProps } from './color-picker.props.js';
import { colorPickerSchema } from '../../schema/color-picker/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function ColorPicker(props: ColorPickerProps): ReactNode {
  return useDeclaration('ColorPicker', colorPickerSchema, props);
}
