import type { JSONContent } from '@tiptap/core';
import { Fragment, Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';

export function applyEditorPlainPaste(
  view: EditorView,
  content: readonly JSONContent[],
): void {
  const marks = view.state.storedMarks ?? view.state.selection.$from.marks();
  const nodes = content.map((value) => {
    const node = view.state.schema.nodeFromJSON(value);
    return node.isText ? node.mark(marks) : node;
  });
  view.dispatch(
    view.state.tr
      .replaceSelection(new Slice(Fragment.from(nodes), 0, 0))
      .ensureMarks(marks)
      .scrollIntoView(),
  );
}
