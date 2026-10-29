import { Node } from '@tiptap/core';
import { editorAtomData } from './atom-data.js';
import type { EditorAtomKind } from './atom-data.js';

export function createEditorAtom(kind: EditorAtomKind) {
  return Node.create({
    name: kind === 'mention' ? 'reacdMention' : 'reacdEmoji',
    group: 'inline',
    inline: true,
    atom: true,
    addAttributes() {
      return kind === 'mention'
        ? { id: { default: null }, label: { default: null } }
        : { name: { default: null }, value: { default: null } };
    },
    parseHTML() {
      return [];
    },
    renderHTML({ node }) {
      const data = editorAtomData(kind, node.attrs);
      return ['span', data.attributes, data.text];
    },
    renderText({ node }) {
      return editorAtomData(kind, node.attrs).text;
    },
  });
}
