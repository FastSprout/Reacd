import type { ReactNode } from 'react';
import type { AvatarProps } from './avatar.props.js';
import { avatarSchema } from '../../schema/avatar/avatar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { AvatarProps } from './avatar.props.js';
export function Avatar(props: AvatarProps): ReactNode {
  return useDeclaration('Avatar', avatarSchema, props);
}
