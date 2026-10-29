import type { ReactNode } from 'react';
import type { ColorModeImageProps } from './color-mode-image.props.js';
import { colorModeImageSchema } from '../../schema/color-mode-image/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ColorModeImage(props: ColorModeImageProps): ReactNode {
  return useDeclaration('ColorModeImage', colorModeImageSchema, props);
}
