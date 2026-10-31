import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { editorSuggestionMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-suggestion-menu/index.js';
import { editorMentionMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-mention-menu/index.js';
import { editorEmojiMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-emoji-menu/index.js';
import { ShadcnEditorSuggestionMenu } from
  '../editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import { ShadcnEditorMentionMenu } from
  '../editor-mention-menu/editor-mention-menu.adapter.js';
import { ShadcnEditorEmojiMenu } from
  '../editor-emoji-menu/editor-emoji-menu.adapter.js';

export const editorMenuEntries = {
  EditorSuggestionMenu: renderEntry(
    'EditorSuggestionMenu',
    editorSuggestionMenuSchema,
    ShadcnEditorSuggestionMenu,
  ),
  EditorMentionMenu: renderEntry(
    'EditorMentionMenu',
    editorMentionMenuSchema,
    ShadcnEditorMentionMenu,
  ),
  EditorEmojiMenu: renderEntry(
    'EditorEmojiMenu',
    editorEmojiMenuSchema,
    ShadcnEditorEmojiMenu,
  ),
};
