import * as Lookup from '../../../docs/examples/editor-mention-lookup.js';
import * as Mentions from '../../../docs/examples/editor-mention-menu.js';
import * as Suggestions from '../../../docs/examples/editor-suggestion-menu.js';
import { VStack } from '@fastsprout/reacd';
import { EditorExample } from '../../../docs/examples/editor.js';
import { EditorControlledExample } from '../../../docs/examples/editor-controlled.js';
import { EditorToolbarExample } from '../../../docs/examples/editor-toolbar.js';
import { EditorDragHandleExample } from '../../../docs/examples/editor-drag-handle.js';

import { EditorEmojiMenuExample } from '../../../docs/examples/editor-emoji-menu.js';

export function EditorExamples() {
  return (
    <VStack>
      <EditorExample />
      <EditorControlledExample />
      <EditorToolbarExample />
      <EditorDragHandleExample />
      <Suggestions.EditorSuggestionMenuExample />
      <Mentions.EditorMentionMenuExample />
      <Lookup.EditorMentionLookupExample />
      <EditorEmojiMenuExample />
    </VStack>
  );
}
