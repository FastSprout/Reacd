import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { editorDragHandleSchema } from '../../../schema/editor-drag-handle/index.js';
import * as Handle from '../editor-drag-handle/editor-drag-handle.adapter.js';
export const editorDragHandleEntries = {
  EditorDragHandle: renderEntry(
    'EditorDragHandle',
    editorDragHandleSchema,
    Handle.ShadcnEditorDragHandle,
  ),
};
