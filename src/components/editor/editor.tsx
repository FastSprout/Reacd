import type { ReactNode } from 'react';
import type { EditorProps } from './editor.props.js';
import { editorSchema } from '../../schema/editor/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { EditorProps } from './editor.props.js';
export function Editor(props: EditorProps): ReactNode {
  return useDeclaration('Editor', editorSchema, props);
}
