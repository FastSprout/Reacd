import type { ReactNode } from 'react';
import type { InputDateProps } from './input-date.props.js';
import { inputDateSchema } from '../../schema/input-date/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function InputDate(props: InputDateProps): ReactNode {
  return useDeclaration('InputDate', inputDateSchema, props);
}
