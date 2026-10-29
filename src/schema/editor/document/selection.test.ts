import { expect, it } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorDocumentSchema } from './document.schema.js';
import { editorSelectionSchema } from './selection.schema.js';

const document = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'intro',
      content: [
        { type: 'text', text: 'A😀' },
        { type: 'hardBreak' },
        { type: 'mention', id: 'person', label: 'Long example label' },
        { type: 'emoji', name: 'wave', value: '👋' },
      ],
    },
    { type: 'heading', id: 'title', level: 1, content: [] },
    {
      type: 'quote',
      id: 'quote',
      children: [{ type: 'codeBlock', id: 'code', text: 'code' }],
    },
    {
      type: 'bulletList',
      id: 'list',
      items: [
        {
          type: 'listItem',
          id: 'item',
          children: [{ type: 'paragraph', id: 'itemText', content: [] }],
        },
      ],
    },
    { type: 'separator', id: 'rule' },
  ],
});

it('resolves UTF-16 text and single-unit atoms across ordered editable blocks', () => {
  const schema = editorSelectionSchema(document);
  expect(
    schema.safeParse({
      anchor: { blockId: 'intro', offset: 6 },
      focus: { blockId: 'code', offset: 4 },
    }).success,
  ).toBe(true);
  expect(
    schema.safeParse({
      anchor: { blockId: 'code', offset: 4 },
      focus: { blockId: 'intro', offset: 0 },
    }).success,
  ).toBe(true);
  expect(
    schema.safeParse({
      anchor: { blockId: 'title', offset: 0 },
      focus: { blockId: 'itemText', offset: 0 },
    }).success,
  ).toBe(true);
});

it('allows long multi-node block offsets within the aggregate document budget', () => {
  const long = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'long',
        content: [
          { type: 'text', text: 'a'.repeat(EDITOR_POLICY.maxTextLength) },
          { type: 'text', text: 'b' },
        ],
      },
    ],
  });
  const end = { blockId: 'long', offset: EDITOR_POLICY.maxTextLength + 1 };
  expect(
    editorSelectionSchema(long).safeParse({ anchor: end, focus: end }).success,
  ).toBe(true);
});

it('rejects invalid ids and offsets without SDK positions', () => {
  const schema = editorSelectionSchema(document);
  for (const anchor of [
    { blockId: 'missing', offset: 0 },
    { blockId: 'quote', offset: 0 },
    { blockId: 'list', offset: 0 },
    { blockId: 'item', offset: 0 },
    { blockId: 'rule', offset: 0 },
    { blockId: 'intro', offset: 7 },
    { blockId: 'intro', offset: -1 },
    { blockId: 'intro', offset: 0.5 },
    { blockId: 'code', offset: NaN },
    { blockId: 'code', offset: 5 },
  ])
    expect(
      schema.safeParse({ anchor, focus: { blockId: 'intro', offset: 0 } }).success,
    ).toBe(false);
  expect(
    schema.safeParse({
      anchor: { blockId: 'intro', offset: 0 },
      focus: { blockId: 'intro', offset: 99 },
    }).success,
  ).toBe(false);
  expect(
    schema.safeParse({
      anchor: { blockId: 'intro', offset: 0, dom: 'ref' },
      focus: { blockId: 'intro', offset: 0 },
    }).success,
  ).toBe(false);
});
