import { VStack } from 'reacd';
import { EditorExample } from '../../docs/examples/editor.js';
import { EditorControlledExample } from '../../docs/examples/editor-controlled.js';
import { EditorToolbarExample } from '../../docs/examples/editor-toolbar.js';
import { EditorDragHandleExample } from '../../docs/examples/editor-drag-handle.js';
import {
  EditorSuggestionMenuExample,
} from '../../docs/examples/editor-suggestion-menu.js';
import { EditorMentionMenuExample } from '../../docs/examples/editor-mention-menu.js';
import {
  EditorMentionLookupExample,
} from '../../docs/examples/editor-mention-lookup.js';
import { EditorEmojiMenuExample } from '../../docs/examples/editor-emoji-menu.js';

export function EditorExamples() {
  return (
    <VStack>
      <EditorExample />
      <EditorControlledExample />
      <EditorToolbarExample />
      <EditorDragHandleExample />
      <EditorSuggestionMenuExample />
      <EditorMentionMenuExample />
      <EditorMentionLookupExample />
      <EditorEmojiMenuExample />
    </VStack>
  );
}
