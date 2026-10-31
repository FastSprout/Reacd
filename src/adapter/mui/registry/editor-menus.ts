import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { editorSuggestionMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-suggestion-menu/index.js';
import { editorMentionMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-mention-menu/index.js';
import { editorEmojiMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-emoji-menu/index.js';
import { MuiEditorSuggestionMenu } from
  '../editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import { MuiEditorMentionMenu } from
  '../editor-mention-menu/editor-mention-menu.adapter.js';
import { MuiEditorEmojiMenu } from '../editor-emoji-menu/editor-emoji-menu.adapter.js';

export const editorMenuEntries = {
  EditorSuggestionMenu: renderEntry(
    'EditorSuggestionMenu',
    editorSuggestionMenuSchema,
    MuiEditorSuggestionMenu,
  ),
  EditorMentionMenu: renderEntry(
    'EditorMentionMenu',
    editorMentionMenuSchema,
    MuiEditorMentionMenu,
  ),
  EditorEmojiMenu: renderEntry(
    'EditorEmojiMenu',
    editorEmojiMenuSchema,
    MuiEditorEmojiMenu,
  ),
};
