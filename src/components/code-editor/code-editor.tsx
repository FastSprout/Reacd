import type { ReactNode } from 'react';
import type { CodeEditorProps } from './code-editor.props.js';
import { codeEditorSchema } from '../../schema/code-editor/code-editor.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { CodeEditorProps } from './code-editor.props.js';
export function CodeEditor(props: CodeEditorProps): ReactNode {
  return useDeclaration('CodeEditor', codeEditorSchema, props);
}
