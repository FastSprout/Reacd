import type { ReactNode } from 'react';
import type { TextareaProps } from './textarea.props.js';
import { textareaSchema } from '../../schema/textarea/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Textarea(props: TextareaProps): ReactNode {
  return useDeclaration('Textarea', textareaSchema, props);
}
