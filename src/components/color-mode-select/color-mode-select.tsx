import type { ReactNode } from 'react';
import type { ColorModeSelectProps } from './color-mode-select.props.js';
import { colorModeSelectSchema } from '../../schema/color-mode-select/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ColorModeSelect(props: ColorModeSelectProps): ReactNode {
  return useDeclaration('ColorModeSelect', colorModeSelectSchema, props);
}
