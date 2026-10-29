import type { Editor } from '@tiptap/core';
import { EDITOR_NATIVE_POLICY } from '../../../core/editor-native-policy.js';

export function selectSdkBlock(editor: Editor, id: string): boolean {
  let target: { position: number; text: boolean } | undefined;
  editor.state.doc.descendants((node, position) => {
    if (target !== undefined || node.attrs['reacdId'] !== id)
      return target === undefined;
    if (node.isTextblock) {
      target = {
        position: position + EDITOR_NATIVE_POLICY.nodeOpeningSize,
        text: true,
      };
      return false;
    }
    node.descendants((child, offset) => {
      if (target !== undefined || !child.isTextblock) return target === undefined;
      target = {
        position: position + offset + EDITOR_NATIVE_POLICY.nodeOpeningSize * 2,
        text: true,
      };
      return false;
    });
    target ??= { position, text: false };
    return false;
  });
  if (target === undefined) return false;
  return target.text
    ? editor.chain().focus().setTextSelection(target.position).run()
    : editor.chain().focus().setNodeSelection(target.position).run();
}
