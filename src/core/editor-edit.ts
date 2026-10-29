import type { EditorDocument, EditorSelection } from './editor-document.js';

export interface EditorEdit {
  readonly value: EditorDocument;
  readonly selection: EditorSelection;
}
