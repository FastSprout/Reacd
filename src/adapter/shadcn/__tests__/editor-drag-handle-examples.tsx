import { Editor } from '../../../components/editor/index.js';
import { EditorDragHandle } from '../../../components/editor-drag-handle/index.js';
import type { EditorDocument } from '../../../core/editor-document.js';
const DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'second', content: [{ type: 'text', text: 'Second' }] },
  ],
};
export const EDITOR_DRAG_HANDLE_EXAMPLES = {
  EditorDragHandle: (
    <Editor
      label="Example reorder editor"
      value={DOCUMENT}
      onValueChange={() => undefined}
      toolbar={<EditorDragHandle label="Example block" blockId="first" />}
    />
  ),
};
