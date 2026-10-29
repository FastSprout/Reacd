import type { ReactNode } from 'react';
import type { AvatarGroupProps } from './avatar-group.props.js';
import { avatarGroupSchema } from '../../schema/avatar-group/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { AvatarGroupProps } from './avatar-group.props.js';
export function AvatarGroup(props: AvatarGroupProps): ReactNode {
  return useDeclaration('AvatarGroup', avatarGroupSchema, props);
}
