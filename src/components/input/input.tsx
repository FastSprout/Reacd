import type { ReactNode } from 'react';
import type { InputProps } from './input.props.js';
import { inputComponentSchema } from '../../schema/input/input.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { InputProps } from './input.props.js';
export function Input(props: InputProps): ReactNode {
  return useDeclaration('Input', inputComponentSchema, props);
}
