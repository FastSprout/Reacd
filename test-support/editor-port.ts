import type { EditorDocument } from '../src/core/editor-document.js';
import { editorBlockMoves } from '../src/core/editor-reorder.js';
import type { EditorPort } from '../src/renderer/editor/editor-context.js';

export function editorPortFixture(
  document: EditorDocument,
  overrides: Partial<EditorPort> = {},
): EditorPort {
  return {
    document,
    selection: undefined,
    selectedBlockId: undefined,
    disabled: false,
    active: () => false,
    available: () => false,
    execute: () => undefined,
    blockMoves: (id) => editorBlockMoves(document, id),
    selectBlock: () => undefined,
    moveBlock: () => undefined,
    beginBlockDrag: () => false,
    cancelBlockDrag: () => undefined,
    ...overrides,
  };
}
