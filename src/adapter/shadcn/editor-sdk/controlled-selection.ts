import type { EditorSelection } from '../../../core/editor-document.js';

export function sameEditorSelection(
  left: EditorSelection | undefined,
  right: EditorSelection | undefined,
): boolean {
  if (left === undefined || right === undefined) return left === right;
  return (
    left.anchor.blockId === right.anchor.blockId &&
    left.anchor.offset === right.anchor.offset &&
    left.focus.blockId === right.focus.blockId &&
    left.focus.offset === right.focus.offset
  );
}
