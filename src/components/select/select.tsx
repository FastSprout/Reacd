import type { ReactNode } from 'react';
import type { SelectProps } from './select.props.js';
import { selectSchema } from '../../schema/select/select.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SelectProps } from './select.props.js';
export function Select(props: SelectProps): ReactNode {
  return useDeclaration('Select', selectSchema, props);
}
