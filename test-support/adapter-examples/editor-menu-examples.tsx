import { Editor } from '../../src/components/editor/index.js';
import { EditorSuggestionMenu } from
  '../../src/components/editor-suggestion-menu/index.js';
import { EditorMentionMenu } from '../../src/components/editor-mention-menu/index.js';
import { EditorEmojiMenu } from '../../src/components/editor-emoji-menu/index.js';
import type { EditorDocument } from '../../src/core/editor-document.js';

const DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};
export const EDITOR_MENU_EXAMPLES = {
  EditorSuggestionMenu: (
    <Editor label="Suggestion editor" value={DOCUMENT} onValueChange={() => undefined}>
      <EditorSuggestionMenu
        label="Insert block"
        items={[{ command: 'heading1', label: 'Heading' }]}
      />
    </Editor>
  ),
  EditorMentionMenu: (
    <Editor label="Mention editor" value={DOCUMENT} onValueChange={() => undefined}>
      <EditorMentionMenu
        label="People"
        items={[{ id: 'person', label: 'Example person' }]}
      />
    </Editor>
  ),
  EditorEmojiMenu: (
    <Editor label="Emoji editor" value={DOCUMENT} onValueChange={() => undefined}>
      <EditorEmojiMenu
        label="Emoji"
        items={[{ name: 'wave', label: 'Wave', value: '👋' }]}
      />
    </Editor>
  ),
};
