import { Editor } from '@tiptap/core';
import { createEditorExtensions } from '../src/adapter/shadcn/editor-sdk/extensions.js';

export function createMenuEditor(block: 'paragraph' | 'codeBlock' = 'paragraph') {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const instance = new Editor({
    element: host,
    injectCSS: false,
    extensions: createEditorExtensions(),
    editorProps: { attributes: { role: 'textbox', 'aria-label': 'Native menu' } },
    content: {
      type: 'doc',
      content: [{ type: block, attrs: { reacdId: 'fixture', language: 'plain' } }],
    },
  });
  return {
    instance,
    input: instance.view.dom,
    dispose() {
      if (!instance.isDestroyed) instance.destroy();
      host.remove();
    },
  };
}
