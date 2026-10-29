import type { ReactNode } from 'react';
import type { InputTimeProps } from './input-time.props.js';
import { inputTimeSchema } from '../../schema/input-time/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function InputTime(props: InputTimeProps): ReactNode {
  return useDeclaration('InputTime', inputTimeSchema, props);
}
