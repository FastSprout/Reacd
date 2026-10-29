import { expect, it } from 'vitest';
import { editorDocumentSchema } from '../schema/editor/document/index.js';
import { success } from '../../test-support/data-table.js';
import { moveEditorBlockTo } from './editor-drop.js';

const input = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'a', content: [] },
    { type: 'heading', id: 'b', level: 1, content: [] },
    {
      type: 'quote',
      id: 'quote',
      children: [
        { type: 'paragraph', id: 'q1', content: [] },
        { type: 'paragraph', id: 'q2', content: [] },
        { type: 'paragraph', id: 'q3', content: [] },
      ],
    },
    {
      type: 'bulletList',
      id: 'list',
      items: [
        {
          type: 'listItem',
          id: 'item1',
          children: [
            { type: 'paragraph', id: 'start', content: [] },
            { type: 'heading', id: 'heading', level: 2, content: [] },
            { type: 'paragraph', id: 'tail', content: [] },
          ],
        },
        {
          type: 'listItem',
          id: 'item2',
          children: [{ type: 'paragraph', id: 'other', content: [] }],
        },
      ],
    },
    {
      type: 'orderedList',
      id: 'ordered',
      start: 4,
      items: [
        {
          type: 'listItem',
          id: 'ordered1',
          children: [{ type: 'paragraph', id: 'orderedText1', content: [] }],
        },
        {
          type: 'listItem',
          id: 'ordered2',
          children: [{ type: 'paragraph', id: 'orderedText2', content: [] }],
        },
      ],
    },
    { type: 'separator', id: 'z' },
  ],
});

it('moves before and after in both directions with a single frozen result', () => {
  const original = JSON.stringify(input);
  for (const [source, target, placement, expected] of [
    ['a', 'z', 'before', ['b', 'quote', 'list', 'ordered', 'a', 'z']],
    ['a', 'z', 'after', ['b', 'quote', 'list', 'ordered', 'z', 'a']],
    ['z', 'a', 'before', ['z', 'a', 'b', 'quote', 'list', 'ordered']],
    ['z', 'a', 'after', ['a', 'z', 'b', 'quote', 'list', 'ordered']],
  ] as const) {
    const result = success(moveEditorBlockTo(input, source, target, placement));
    expect(result.blocks.map((block) => block.id)).toEqual(expected);
    expect(result.blocks.find((block) => block.id === 'quote')).toBe(input.blocks[2]);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.blocks)).toBe(true);
    expect(editorDocumentSchema.safeParse(result).success).toBe(true);
  }
  expect(JSON.stringify(input)).toBe(original);
});

it('preserves nested structure and ordered-list metadata', () => {
  const quote = success(moveEditorBlockTo(input, 'q3', 'q1', 'before')).blocks[2];
  if (quote?.type !== 'quote') throw new Error('Expected quote.');
  expect(quote.children.map((block) => block.id)).toEqual(['q3', 'q1', 'q2']);
  const list = success(moveEditorBlockTo(input, 'item1', 'item2', 'after')).blocks[3];
  if (list?.type !== 'bulletList') throw new Error('Expected bullet list.');
  expect(list.items.map((item) => item.id)).toEqual(['item2', 'item1']);
  const ordered = success(moveEditorBlockTo(input, 'ordered2', 'ordered1', 'before'))
    .blocks[4];
  if (ordered?.type !== 'orderedList') throw new Error('Expected ordered list.');
  expect(ordered.start).toBe(4);
  expect(ordered.items.map((item) => item.id)).toEqual(['ordered2', 'ordered1']);
  const children = success(moveEditorBlockTo(input, 'tail', 'heading', 'before'))
    .blocks[3];
  if (children?.type !== 'bulletList') throw new Error('Expected list children.');
  expect(children.items[0]?.children.map((block) => block.id)).toEqual([
    'start',
    'tail',
    'heading',
  ]);
});

it('retains exact identity for no-ops and rejects reparenting or invalid moves', () => {
  for (const [source, target, placement] of [
    ['a', 'a', 'before'],
    ['a', 'a', 'after'],
    ['a', 'b', 'before'],
    ['b', 'a', 'after'],
  ] as const)
    expect(success(moveEditorBlockTo(input, source, target, placement))).toBe(input);
  for (const [source, target, placement] of [
    ['missing', 'a', 'before'],
    ['a', 'missing', 'after'],
    ['q1', 'a', 'before'],
    ['item1', 'ordered1', 'after'],
    ['tail', 'other', 'before'],
    ['heading', 'start', 'before'],
    ['start', 'tail', 'after'],
    ['orderedText2', 'q1', 'before'],
  ] as const)
    expect(moveEditorBlockTo(input, source, target, placement).success).toBe(false);
});
