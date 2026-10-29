import type { ReactNode } from 'react';
import type { CodeBlockProps } from './code-block.props.js';
import { codeBlockSchema } from '../../schema/code-block/code-block.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { CodeBlockProps } from './code-block.props.js';
export function CodeBlock(props: CodeBlockProps): ReactNode {
  return useDeclaration('CodeBlock', codeBlockSchema, props);
}
