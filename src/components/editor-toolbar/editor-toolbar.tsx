import type { ReactNode } from 'react';
import type { EditorToolbarProps } from './editor-toolbar.props.js';
import { editorToolbarSchema } from '../../schema/editor-toolbar/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { EditorToolbarProps } from './editor-toolbar.props.js';
export function EditorToolbar(props: EditorToolbarProps): ReactNode {
  return useDeclaration('EditorToolbar', editorToolbarSchema, props);
}
