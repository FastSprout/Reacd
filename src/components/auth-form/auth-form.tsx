import type { ReactNode } from 'react';
import type { AuthFormProps } from './auth-form.props.js';
import { authFormSchema } from '../../schema/auth-form/auth-form.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { AuthFormProps } from './auth-form.props.js';
export function AuthForm(props: AuthFormProps): ReactNode {
  return useDeclaration('AuthForm', authFormSchema, props);
}
