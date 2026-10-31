import type { EditorDocument } from
  '@fastsprout/reacd/adapter-runtime/core/editor-document.js';
import { editorBlockMoves } from
  '@fastsprout/reacd/adapter-runtime/core/editor-reorder.js';
import { moveEditorBlockTo } from
  '@fastsprout/reacd/adapter-runtime/core/editor-drop.js';
import { EDITOR_NATIVE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/editor-native-policy.js';
import { stateKeySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/shared/definition.js';

export function createEditorDragSession() {
  let source: string | undefined;
  return {
    begin(document: EditorDocument, id: string): boolean {
      const moves = editorBlockMoves(document, id);
      source = moves.up || moves.down ? id : undefined;
      return source !== undefined;
    },
    cancel() {
      source = undefined;
    },
    drop(
      document: EditorDocument,
      target: EventTarget | null,
      clientY: number,
      root: HTMLElement,
    ): EditorDocument | undefined {
      const current = source;
      source = undefined;
      if (
        current === undefined ||
        !(target instanceof Element) ||
        !root.contains(target)
      )
        return undefined;
      let element: Element | null = target.closest(EDITOR_NATIVE_POLICY.blockSelector);
      while (element !== null && root.contains(element)) {
        const id = stateKeySchema.safeParse(
          element.getAttribute(EDITOR_NATIVE_POLICY.blockAttribute),
        );
        if (id.success) {
          const rectangle = element.getBoundingClientRect();
          const placement =
            clientY < rectangle.top + rectangle.height * EDITOR_NATIVE_POLICY.dropSplit
              ? 'before'
              : 'after';
          const moved = moveEditorBlockTo(document, current, id.data, placement);
          if (moved.success) return moved.data;
        }
        element =
          element.parentElement?.closest(EDITOR_NATIVE_POLICY.blockSelector) ?? null;
      }
      return undefined;
    },
  };
}
export type EditorDragSession = ReturnType<typeof createEditorDragSession>;
