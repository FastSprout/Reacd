import type { ReactNode } from 'react';
import type { InputNumberProps } from './input-number.props.js';
import { inputNumberSchema } from '../../schema/input-number/input-number.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { InputNumberProps } from './input-number.props.js';
export function InputNumber(props: InputNumberProps): ReactNode {
  return useDeclaration('InputNumber', inputNumberSchema, props);
}
