import type { ReactNode } from 'react';
import { fieldGroupSchema } from '../../schema/field-group/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { FieldGroupProps } from './field-group.props.js';

export function FieldGroup(props: FieldGroupProps): ReactNode {
  return useDeclaration('FieldGroup', fieldGroupSchema, props);
}
