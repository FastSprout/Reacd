import type { ReactNode } from 'react';
import { editorEmojiMenuSchema } from '../../schema/editor-emoji-menu/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { EditorEmojiMenuProps } from './editor-emoji-menu.props.js';

export type { EditorEmojiMenuProps } from './editor-emoji-menu.props.js';
export function EditorEmojiMenu(props: EditorEmojiMenuProps): ReactNode {
  return useDeclaration('EditorEmojiMenu', editorEmojiMenuSchema, props);
}
