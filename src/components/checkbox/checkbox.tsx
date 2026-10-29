import type { ReactNode } from 'react';
import type { CheckboxProps } from './checkbox.props.js';
import { checkboxSchema } from '../../schema/checkbox/checkbox.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { CheckboxProps } from './checkbox.props.js';
export function Checkbox(props: CheckboxProps): ReactNode {
  return useDeclaration('Checkbox', checkboxSchema, props);
}
