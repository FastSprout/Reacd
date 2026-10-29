import type { ReactNode } from 'react';
import type { EditorDragHandleProps } from './editor-drag-handle.props.js';
import { editorDragHandleSchema } from '../../schema/editor-drag-handle/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function EditorDragHandle(props: EditorDragHandleProps): ReactNode {
  return useDeclaration('EditorDragHandle', editorDragHandleSchema, props);
}
