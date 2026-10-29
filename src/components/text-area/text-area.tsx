import type { ReactNode } from 'react';
import type { TextAreaProps } from './text-area.props.js';
import { textAreaSchema } from '../../schema/text-area/text-area.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { TextAreaProps } from './text-area.props.js';
export function TextArea(props: TextAreaProps): ReactNode {
  return useDeclaration('TextArea', textAreaSchema, props);
}
