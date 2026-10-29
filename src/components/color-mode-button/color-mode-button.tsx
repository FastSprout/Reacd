import type { ReactNode } from 'react';
import type { ColorModeButtonProps } from './color-mode-button.props.js';
import { colorModeButtonSchema } from '../../schema/color-mode-button/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ColorModeButton(props: ColorModeButtonProps): ReactNode {
  return useDeclaration('ColorModeButton', colorModeButtonSchema, props);
}
