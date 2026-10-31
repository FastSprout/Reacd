import type { EditorProps } from
  '@fastsprout/reacd/adapter-runtime/components/editor/index.js';
import type {
  EditorDocument,
  EditorSelection,
} from '@fastsprout/reacd/adapter-runtime/core/editor-document.js';
import { editorSelectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor/document/index.js';

export function publishEditorDocument(
  properties: EditorProps,
  value: EditorDocument,
  selection: EditorSelection | undefined,
): boolean {
  if (properties.onEditChange !== undefined) {
    const parsed = editorSelectionSchema(value).safeParse(selection);
    if (!parsed.success) return false;
    properties.onEditChange(Object.freeze({ value, selection: parsed.data }));
  } else properties.onValueChange(value);
  return true;
}
