import type { ReactNode } from 'react';
import type { UserProps } from './user.props.js';
import { userSchema } from '../../schema/user/user.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { UserProps } from './user.props.js';
export function User(props: UserProps): ReactNode {
  return useDeclaration('User', userSchema, props);
}
