import type { ReactNode } from 'react';
import type { FormFieldProps } from './form-field.props.js';
import { formFieldSchema } from '../../schema/form-field/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function FormField(props: FormFieldProps): ReactNode {
  return useDeclaration('FormField', formFieldSchema, props);
}
