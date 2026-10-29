import { expect, it } from 'vitest';
import { editorDocumentSchema } from '../schema/editor/document/index.js';
import type { EditorDocument } from './editor-document.js';
import { editorBlockMoves, moveEditorBlock } from './editor-reorder.js';

const input = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'Opening' }] },
    { type: 'heading', id: 'heading', level: 2, content: [] },
    {
      type: 'quote',
      id: 'quote',
      children: [
        { type: 'paragraph', id: 'quoted', content: [] },
        {
          type: 'codeBlock',
          id: 'code',
          text: 'const count = 1;',
          language: 'typescript',
        },
      ],
    },
    {
      type: 'bulletList',
      id: 'bullets',
      items: [
        {
          type: 'listItem',
          id: 'item-a',
          children: [
            { type: 'paragraph', id: 'item-start', content: [] },
            { type: 'heading', id: 'item-heading', level: 3, content: [] },
            { type: 'paragraph', id: 'item-tail', content: [] },
          ],
        },
        {
          type: 'listItem',
          id: 'item-b',
          children: [
            { type: 'paragraph', id: 'second-start', content: [] },
            { type: 'paragraph', id: 'second-tail', content: [] },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      id: 'ordered',
      start: 3,
      items: [
        {
          type: 'listItem',
          id: 'ordered-a',
          children: [{ type: 'paragraph', id: 'ordered-text-a', content: [] }],
        },
        {
          type: 'listItem',
          id: 'ordered-b',
          children: [{ type: 'paragraph', id: 'ordered-text-b', content: [] }],
        },
      ],
    },
    { type: 'separator', id: 'last' },
  ],
});

function moved(id: string, direction: 'up' | 'down'): EditorDocument {
  const result = moveEditorBlock(input, id, direction);
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  expect(editorDocumentSchema.safeParse(result.data).success).toBe(true);
  expect(Object.isFrozen(result.data)).toBe(true);
  expect(Object.isFrozen(result.data.blocks)).toBe(true);
  return result.data;
}

it('reorders root siblings without mutating values or unrelated identities', () => {
  const before = JSON.stringify(input);
  const result = moved('heading', 'up');
  expect(result.blocks.map((block) => block.id)).toEqual([
    'heading',
    'first',
    'quote',
    'bullets',
    'ordered',
    'last',
  ]);
  expect(result.blocks[2]).toBe(input.blocks[2]);
  expect(moved('first', 'down').blocks).toEqual(result.blocks);
  expect(JSON.stringify(input)).toBe(before);
  expect(editorBlockMoves(input, 'first')).toEqual({ up: false, down: true });
  expect(editorBlockMoves(input, 'heading')).toEqual({ up: true, down: true });
  expect(editorBlockMoves(input, 'last')).toEqual({ up: true, down: false });
});

it('reorders quote blocks, list items and nested list children', () => {
  const quote = moved('code', 'up').blocks.find((block) => block.id === 'quote');
  if (quote?.type !== 'quote') throw new Error('Quote is missing.');
  expect(quote.children.map((block) => block.id)).toEqual(['code', 'quoted']);
  const bullets = moved('item-b', 'up').blocks.find((block) => block.id === 'bullets');
  if (bullets?.type !== 'bulletList') throw new Error('List is missing.');
  expect(bullets.items.map((item) => item.id)).toEqual(['item-b', 'item-a']);
  const ordered = moved('ordered-a', 'down').blocks.find(
    (block) => block.id === 'ordered',
  );
  if (ordered?.type !== 'orderedList') throw new Error('Ordered list is missing.');
  expect(ordered.start).toBe(3);
  expect(ordered.items.map((item) => item.id)).toEqual(['ordered-b', 'ordered-a']);
  const nested = moved('item-tail', 'up').blocks.find(
    (block) => block.id === 'bullets',
  );
  if (nested?.type !== 'bulletList') throw new Error('Nested list is missing.');
  expect(nested.items[0]?.children.map((block) => block.id)).toEqual([
    'item-start',
    'item-tail',
    'item-heading',
  ]);
  expect(nested.items[1]).toBe(
    input.blocks[3]?.type === 'bulletList' ? input.blocks[3].items[1] : undefined,
  );
  moved('second-tail', 'up');
  moved('second-start', 'down');
});

it('rejects boundaries, missing ids and invalid first-paragraph moves', () => {
  for (const [id, direction] of [
    ['first', 'up'],
    ['last', 'down'],
    ['quoted', 'up'],
    ['code', 'down'],
    ['item-a', 'up'],
    ['item-b', 'down'],
    ['ordered-a', 'up'],
    ['item-start', 'down'],
    ['item-heading', 'up'],
    ['ordered-text-a', 'down'],
    ['missing', 'up'],
    ['missing', 'down'],
  ] as const)
    expect(moveEditorBlock(input, id, direction).success).toBe(false);
  expect(editorBlockMoves(input, 'item-start')).toEqual({ up: false, down: false });
  expect(editorBlockMoves(input, 'item-heading')).toEqual({ up: false, down: true });
  expect(editorBlockMoves(input, 'missing')).toEqual({ up: false, down: false });
});
