import type { Editor } from '@tiptap/core';

export function createEditorResources() {
  const editors = new Set<Editor>();
  return {
    capture(editor: Editor) {
      editors.add(editor);
      editor.on('destroy', () => {
        editors.delete(editor);
      });
    },
    dispose() {
      for (const editor of editors) editor.destroy();
      editors.clear();
    },
  };
}
