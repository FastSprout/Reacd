import type { ReactNode } from 'react';
import type { FormProps } from './form.props.js';
import { formSchema } from '../../schema/form/form.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { FormProps, FormSummaryIssue } from './form.props.js';
export function Form(props: FormProps): ReactNode {
  return useDeclaration('Form', formSchema, props);
}
