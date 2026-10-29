import type { ReactNode } from 'react';
import {
  editorSuggestionMenuSchema,
} from '../../schema/editor-suggestion-menu/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { EditorSuggestionMenuProps } from './editor-suggestion-menu.props.js';

export type { EditorSuggestionMenuProps } from './editor-suggestion-menu.props.js';
export function EditorSuggestionMenu(props: EditorSuggestionMenuProps): ReactNode {
  return useDeclaration('EditorSuggestionMenu', editorSuggestionMenuSchema, props);
}
