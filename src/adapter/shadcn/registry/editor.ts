import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { editorSchema } from '../../../schema/editor/index.js';
import { editorToolbarSchema } from '../../../schema/editor-toolbar/index.js';
import { ShadcnEditor } from '../editor/editor.adapter.js';
import { ShadcnEditorToolbar } from '../editor-toolbar/editor-toolbar.adapter.js';

export const editorEntries = {
  Editor: renderEntry('Editor', editorSchema, ShadcnEditor),
  EditorToolbar: renderEntry('EditorToolbar', editorToolbarSchema, ShadcnEditorToolbar),
};
