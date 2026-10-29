import type { ReactNode } from 'react';
import type { SubmitButtonProps } from './submit-button.props.js';
import { submitButtonSchema } from '../../schema/submit-button/submit-button.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SubmitButtonProps } from './submit-button.props.js';
export function SubmitButton(props: SubmitButtonProps): ReactNode {
  return useDeclaration('SubmitButton', submitButtonSchema, props);
}
