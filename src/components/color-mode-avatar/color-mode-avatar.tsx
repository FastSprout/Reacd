import type { ReactNode } from 'react';
import type { ColorModeAvatarProps } from './color-mode-avatar.props.js';
import { colorModeAvatarSchema } from '../../schema/color-mode-avatar/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function ColorModeAvatar(props: ColorModeAvatarProps): ReactNode {
  return useDeclaration('ColorModeAvatar', colorModeAvatarSchema, props);
}
