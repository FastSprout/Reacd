import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { editorSchema } from '@fastsprout/reacd/adapter-runtime/schema/editor/index.js';
import { editorToolbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor-toolbar/index.js';
import { MuiEditor } from '../editor/editor.adapter.js';
import { MuiEditorToolbar } from '../editor-toolbar/editor-toolbar.adapter.js';

export const editorEntries = {
  Editor: renderEntry('Editor', editorSchema, MuiEditor),
  EditorToolbar: renderEntry('EditorToolbar', editorToolbarSchema, MuiEditorToolbar),
};
