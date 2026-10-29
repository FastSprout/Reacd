import type { EditorBlock, EditorDocument, EditorListItem } from './editor-document.js';
import type { Result } from './result.js';

export type EditorMoveDirection = 'up' | 'down';
export interface EditorBlockMoves {
  readonly up: boolean;
  readonly down: boolean;
}

const EDITOR_MOVE_POLICY = {
  offsets: { up: -1, down: 1 },
  boundary: 'The block cannot move beyond its current sibling array.',
  paragraph: 'A list item must keep a paragraph as its first child.',
  unknown: 'The editor block identifier does not exist in this document.',
} as const;

type Search<Value> =
  { readonly found: false } | { readonly found: true; readonly result: Result<Value> };
const MISSING = { found: false } as const;

function failure(message: string): Result<never> {
  return { success: false, issues: [{ path: 'Editor.value.blocks', message }] };
}

function mapSearch<From, To>(
  search: Search<From>,
  project: (value: From) => To,
): Search<To> {
  if (!search.found) return MISSING;
  return {
    found: true,
    result: search.result.success
      ? { success: true, data: project(search.result.data) }
      : search.result,
  };
}

function moveSiblings<Value extends { id: string; type: string }>(
  values: readonly Value[],
  id: string,
  direction: EditorMoveDirection,
  firstParagraph: boolean,
): Search<readonly Value[]> {
  const position = values.findIndex((value) => value.id === id);
  if (position < 0) return MISSING;
  const target = position + EDITOR_MOVE_POLICY.offsets[direction];
  if (target < 0 || target >= values.length)
    return { found: true, result: failure(EDITOR_MOVE_POLICY.boundary) };
  const next = values
    .map((value, index) => ({
      value,
      position: index === position ? target : index === target ? position : index,
    }))
    .sort((first, second) => first.position - second.position)
    .map((entry) => entry.value);
  if (
    firstParagraph &&
    next.some((value, index) => index === 0 && value.type !== 'paragraph')
  )
    return { found: true, result: failure(EDITOR_MOVE_POLICY.paragraph) };
  return { found: true, result: { success: true, data: Object.freeze(next) } };
}

function moveItems(
  items: readonly EditorListItem[],
  id: string,
  direction: EditorMoveDirection,
): Search<readonly EditorListItem[]> {
  const direct = moveSiblings(items, id, direction, false);
  if (direct.found) return direct;
  for (const item of items) {
    const children = moveBlocks(item.children, id, direction, true);
    if (!children.found) continue;
    return mapSearch(children, (next) => {
      const replacement = Object.freeze({ ...item, children: next });
      return Object.freeze(
        items.map((current) => (current.id === item.id ? replacement : current)),
      );
    });
  }
  return MISSING;
}

function moveInside(
  block: EditorBlock,
  id: string,
  direction: EditorMoveDirection,
): Search<EditorBlock> {
  switch (block.type) {
    case 'quote':
      return mapSearch(moveBlocks(block.children, id, direction, false), (children) =>
        Object.freeze({ ...block, children }),
      );
    case 'bulletList':
    case 'orderedList':
      return mapSearch(moveItems(block.items, id, direction), (items) =>
        Object.freeze({ ...block, items }),
      );
    default:
      return MISSING;
  }
}

function moveBlocks(
  blocks: readonly EditorBlock[],
  id: string,
  direction: EditorMoveDirection,
  firstParagraph: boolean,
): Search<readonly EditorBlock[]> {
  const direct = moveSiblings(blocks, id, direction, firstParagraph);
  if (direct.found) return direct;
  for (const block of blocks) {
    const nested = moveInside(block, id, direction);
    if (!nested.found) continue;
    return mapSearch(nested, (replacement) =>
      Object.freeze(
        blocks.map((current) => (current.id === block.id ? replacement : current)),
      ),
    );
  }
  return MISSING;
}

export function moveEditorBlock(
  document: EditorDocument,
  id: string,
  direction: EditorMoveDirection,
): Result<EditorDocument> {
  const moved = moveBlocks(document.blocks, id, direction, false);
  if (!moved.found) return failure(EDITOR_MOVE_POLICY.unknown);
  return moved.result.success
    ? { success: true, data: Object.freeze({ ...document, blocks: moved.result.data }) }
    : moved.result;
}

export function editorBlockMoves(
  document: EditorDocument,
  id: string,
): EditorBlockMoves {
  return Object.freeze({
    up: moveEditorBlock(document, id, 'up').success,
    down: moveEditorBlock(document, id, 'down').success,
  });
}
