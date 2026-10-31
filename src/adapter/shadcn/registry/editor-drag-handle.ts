import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { editorDragHandleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-drag-handle/index.js';
import * as Handle from '../editor-drag-handle/editor-drag-handle.adapter.js';
export const editorDragHandleEntries = {
  EditorDragHandle: renderEntry(
    'EditorDragHandle',
    editorDragHandleSchema,
    Handle.ShadcnEditorDragHandle,
  ),
};
