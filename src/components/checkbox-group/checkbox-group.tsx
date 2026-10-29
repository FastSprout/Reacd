import type { ReactNode } from 'react';
import type { CheckboxGroupProps } from './checkbox-group.props.js';
import { checkboxGroupSchema } from '../../schema/checkbox-group/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { CheckboxGroupProps } from './checkbox-group.props.js';
export function CheckboxGroup(props: CheckboxGroupProps): ReactNode {
  return useDeclaration('CheckboxGroup', checkboxGroupSchema, props);
}
