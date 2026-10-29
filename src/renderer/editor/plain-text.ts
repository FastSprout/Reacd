import type { EditorBlock, EditorDocument } from '../../core/editor-document.js';
import { EDITOR_DEFAULTS } from '../../core/editor-policy.js';

function blockText(block: EditorBlock): string {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return block.content
        .map((inline) => {
          switch (inline.type) {
            case 'text':
              return inline.text;
            case 'mention':
              return EDITOR_DEFAULTS.mentionPrefix + inline.label;
            case 'emoji':
              return inline.value;
            case 'hardBreak':
              return '\n';
          }
        })
        .join('');
    case 'codeBlock':
      return block.text;
    case 'quote':
      return block.children.map(blockText).join('\n');
    case 'bulletList':
    case 'orderedList':
      return block.items
        .map((item) => item.children.map(blockText).join('\n'))
        .join('\n');
    case 'separator':
      return '';
  }
}
export function editorPlainText(document: EditorDocument): string {
  return document.blocks.map(blockText).join('\n');
}
