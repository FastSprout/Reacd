import type { Editor } from '@tiptap/core';
import type { EditorMenuKind } from
  '@fastsprout/reacd/adapter-runtime/core/editor-menu-policy.js';
import { EDITOR_MENU_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/editor-menu-policy.js';
import type { EditorMenuPort } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import { mountEditorMenu } from './menu-plugin.js';

export function createEditorMenuPort(
  editor: Editor | null,
  disabled: boolean,
): EditorMenuPort {
  const registrations = new Set<EditorMenuKind>();
  return {
    disabled: disabled || editor === null,
    mount(request) {
      if (editor === null || editor.isDestroyed || disabled)
        return {
          success: false,
          issues: [{ path: 'EditorMenu', message: EDITOR_MENU_POLICY.scopeError }],
        };
      if (registrations.has(request.kind))
        return {
          success: false,
          issues: [{ path: 'EditorMenu', message: EDITOR_MENU_POLICY.duplicateError }],
        };
      registrations.add(request.kind);
      return {
        success: true,
        data: mountEditorMenu(editor, request, () => {
          registrations.delete(request.kind);
        }),
      };
    },
  };
}
