import type { ReactNode } from 'react';
import type { ButtonProps } from './button.props.js';
import { buttonComponentSchema } from '../../schema/button/button.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ButtonProps } from './button.props.js';
export function Button(props: ButtonProps): ReactNode {
  return useDeclaration('Button', buttonComponentSchema, props);
}
