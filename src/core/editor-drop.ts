import type { EditorBlock, EditorDocument, EditorListItem } from './editor-document.js';
import { moveEditorBlock } from './editor-reorder.js';
import type { Result } from './result.js';

export type EditorDropPlacement = 'before' | 'after';
const DROP_POLICY = {
  placementOffset: { before: 0, after: 1 },
  invalidTarget: 'Editor blocks can move only within their existing sibling array.',
} as const;

function invalidTarget(): Result<never> {
  return {
    success: false,
    issues: [{ path: 'Editor.value.blocks', message: DROP_POLICY.invalidTarget }],
  };
}

function itemSiblings(
  items: readonly EditorListItem[],
  id: string,
): readonly string[] | undefined {
  if (items.some((item) => item.id === id)) return items.map((item) => item.id);
  for (const item of items) {
    const found = blockSiblings(item.children, id);
    if (found !== undefined) return found;
  }
  return undefined;
}

function blockSiblings(
  blocks: readonly EditorBlock[],
  id: string,
): readonly string[] | undefined {
  if (blocks.some((block) => block.id === id)) return blocks.map((block) => block.id);
  for (const block of blocks) {
    let found: readonly string[] | undefined;
    if (block.type === 'quote') found = blockSiblings(block.children, id);
    if (block.type === 'bulletList' || block.type === 'orderedList')
      found = itemSiblings(block.items, id);
    if (found !== undefined) return found;
  }
  return undefined;
}

export function moveEditorBlockTo(
  document: EditorDocument,
  sourceId: string,
  targetId: string,
  placement: EditorDropPlacement,
): Result<EditorDocument> {
  const siblings = blockSiblings(document.blocks, sourceId);
  if (siblings === undefined) return invalidTarget();
  const source = siblings.indexOf(sourceId);
  const target = siblings.indexOf(targetId);
  if (target < 0) return invalidTarget();
  if (sourceId === targetId) return { success: true, data: document };
  const destination =
    target - (source < target ? 1 : 0) + DROP_POLICY.placementOffset[placement];
  const direction = destination < source ? 'up' : 'down';
  const distance = Math.abs(destination - source);
  let current = document;
  for (let index = 0; index < distance; index += 1) {
    const moved = moveEditorBlock(current, sourceId, direction);
    if (!moved.success) return moved;
    current = moved.data;
  }
  return { success: true, data: current };
}
