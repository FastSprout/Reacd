import type { EditorBlock, EditorDocument, EditorPosition } from './editor-document.js';

export function editorTextLengths(
  document: EditorDocument,
): ReadonlyMap<string, number> {
  const lengths = new Map<string, number>();
  function visit(blocks: readonly EditorBlock[]) {
    for (const block of blocks) {
      if (block.type === 'codeBlock') lengths.set(block.id, block.text.length);
      if (block.type === 'paragraph' || block.type === 'heading')
        lengths.set(
          block.id,
          block.content.reduce(
            (size, node) => size + (node.type === 'text' ? node.text.length : 1),
            0,
          ),
        );
      if (block.type === 'quote') visit(block.children);
      if (block.type === 'bulletList' || block.type === 'orderedList')
        for (const item of block.items) visit(item.children);
    }
  }
  visit(document.blocks);
  return lengths;
}

export function editorPositionExists(
  lengths: ReadonlyMap<string, number>,
  position: EditorPosition,
): boolean {
  const length = lengths.get(position.blockId);
  return (
    length !== undefined &&
    Number.isInteger(position.offset) &&
    position.offset >= 0 &&
    position.offset <= length
  );
}
