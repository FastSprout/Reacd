import type { ReactNode } from 'react';
import type { TextProps } from './text.props.js';
import { textComponentSchema } from '../../schema/text/text.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { TextProps } from './text.props.js';
export function Text(props: TextProps): ReactNode {
  return useDeclaration('Text', textComponentSchema, props);
}
