import { Extension } from '@tiptap/core';
import { EDITOR_SDK_BLOCK_TYPES } from './block-types.js';
import { createEditorIdentityPlugin } from './identity-plugin.js';
import type { EditorIdentityOptions } from './identity-plugin.js';

export function createEditorIdentity(options: EditorIdentityOptions = {}) {
  return Extension.create({
    name: 'reacdBlockIdentity',
    addProseMirrorPlugins() {
      return [createEditorIdentityPlugin(options)];
    },
    addGlobalAttributes() {
      return [
        {
          types: [...EDITOR_SDK_BLOCK_TYPES],
          attributes: {
            reacdId: {
              default: null,
              parseHTML: (element: HTMLElement) =>
                element.getAttribute('data-reacd-block'),
              renderHTML: (attributes: Record<string, unknown>) => {
                const id = attributes['reacdId'];
                return typeof id === 'string' ? { 'data-reacd-block': id } : {};
              },
            },
          },
        },
      ];
    },
  });
}
