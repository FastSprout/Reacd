import type { ReactNode } from 'react';
import { editorMentionMenuSchema } from '../../schema/editor-mention-menu/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { EditorMentionMenuProps } from './editor-mention-menu.props.js';

export type { EditorMentionMenuProps } from './editor-mention-menu.props.js';
export function EditorMentionMenu(props: EditorMentionMenuProps): ReactNode {
  return useDeclaration('EditorMentionMenu', editorMentionMenuSchema, props);
}
