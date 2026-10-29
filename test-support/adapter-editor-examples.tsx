import { Editor } from '../src/components/editor/index.js';
import { EditorToolbar } from '../src/components/editor-toolbar/index.js';
import type { EditorDocument } from '../src/core/editor-document.js';

const DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};

export const EDITOR_EXAMPLES = {
  Editor: (
    <Editor label="Example editor" value={DOCUMENT} onValueChange={() => undefined} />
  ),
  EditorToolbar: (
    <Editor
      label="Example toolbar editor"
      value={DOCUMENT}
      onValueChange={() => undefined}
      toolbar={<EditorToolbar label="Example formatting" />}
    />
  ),
};
