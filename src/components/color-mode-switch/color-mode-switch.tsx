import type { ReactNode } from 'react';
import type { ColorModeSwitchProps } from './color-mode-switch.props.js';
import { colorModeSwitchSchema } from '../../schema/color-mode-switch/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ColorModeSwitch(props: ColorModeSwitchProps): ReactNode {
  return useDeclaration('ColorModeSwitch', colorModeSwitchSchema, props);
}
