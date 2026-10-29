import type { EditorBlock, EditorDocument } from './editor-document.js';

export function editorBlockIds(document: EditorDocument): string[] {
  const ids: string[] = [];
  function visit(blocks: readonly EditorBlock[]) {
    for (const block of blocks) {
      ids.push(block.id);
      if (block.type === 'quote') visit(block.children);
      if (block.type === 'bulletList' || block.type === 'orderedList')
        for (const item of block.items) {
          ids.push(item.id);
          visit(item.children);
        }
    }
  }
  visit(document.blocks);
  return ids;
}
