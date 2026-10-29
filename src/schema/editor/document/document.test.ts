import { expect, it, vi } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorDocumentSchema } from './document.schema.js';

const paragraph = {
  id: 'intro',
  type: 'paragraph',
  content: [
    { type: 'text', text: 'Hello', marks: ['bold'], link: '/reference' },
    { type: 'hardBreak' },
    { type: 'mention', id: 'person', label: 'Example person' },
    { type: 'emoji', name: 'wave', value: '👋' },
  ],
};

it('fails closed on uncloneable proxies without invoking property get traps', () => {
  const get = vi.fn(() => {
    throw new Error('Hostile read');
  });
  const proxy = new Proxy({ version: 1, blocks: [] }, { get });
  expect(editorDocumentSchema.safeParse(proxy).success).toBe(false);
  expect(get).not.toHaveBeenCalled();
});

it('canonicalizes mark sets without changing formatting semantics', () => {
  const parsed = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [{ type: 'text', text: 'Emphasis', marks: ['italic', 'bold'] }],
      },
    ],
  });
  expect(parsed.blocks).toEqual([
    {
      type: 'paragraph',
      id: 'intro',
      content: [{ type: 'text', text: 'Emphasis', marks: ['bold', 'italic'] }],
    },
  ]);
});

it('validates closed nested document semantics and ordered stable ids', () => {
  const document = {
    version: 1,
    blocks: [
      paragraph,
      { id: 'title', type: 'heading', level: 2, content: [] },
      {
        id: 'quote',
        type: 'quote',
        children: [{ id: 'quoteText', type: 'paragraph', content: [] }],
      },
      {
        id: 'code',
        type: 'codeBlock',
        text: 'const count = 1;',
        language: 'typescript',
      },
      {
        id: 'list',
        type: 'orderedList',
        start: 2,
        items: [
          {
            id: 'item',
            type: 'listItem',
            children: [{ id: 'itemText', type: 'paragraph', content: [] }],
          },
        ],
      },
      {
        id: 'bullets',
        type: 'bulletList',
        items: [
          {
            id: 'bullet',
            type: 'listItem',
            children: [{ id: 'bulletText', type: 'paragraph', content: [] }],
          },
        ],
      },
      { id: 'rule', type: 'separator' },
    ],
  };
  const result = editorDocumentSchema.safeParse(document);
  expect(result.success).toBe(true);
  expect(
    editorDocumentSchema.safeParse({
      version: 1,
      blocks: [{ id: 'intro', type: 'codeBlock', text: '' }],
    }).success,
  ).toBe(true);
  expect(
    editorDocumentSchema.safeParse({
      version: 1,
      blocks: [
        {
          id: 'inlineCode',
          type: 'paragraph',
          content: [{ type: 'text', text: 'const count = 1', marks: ['code'] }],
        },
      ],
    }).success,
  ).toBe(true);
});

it('rejects unsupported data, unsafe links and duplicate document identifiers', () => {
  for (const block of [
    { ...paragraph, style: 'color:red' },
    { ...paragraph, type: 'html' },
    { ...paragraph, type: 'heading', level: 4 },
    {
      ...paragraph,
      content: [{ type: 'text', text: 'Hello', marks: ['bold', 'bold'] }],
    },
    { ...paragraph, content: [{ type: 'text', text: 'Hello', marks: ['fontSize'] }] },
    {
      ...paragraph,
      content: [{ type: 'text', text: 'Code', marks: ['code', 'bold'] }],
    },
    {
      ...paragraph,
      content: [{ type: 'text', text: 'Code', marks: ['code'], link: '/reference' }],
    },
    {
      ...paragraph,
      content: [{ type: 'text', text: 'Hello', link: 'javascript:run()' }],
    },
    { ...paragraph, content: [{ type: 'text', text: '' }] },
    { id: 'list', type: 'bulletList', items: [] },
    {
      id: 'list',
      type: 'bulletList',
      items: [
        { id: 'item', type: 'listItem', children: [{ id: 'line', type: 'separator' }] },
      ],
    },
  ])
    expect(
      editorDocumentSchema.safeParse({ version: 1, blocks: [block] }).success,
    ).toBe(false);
  expect(editorDocumentSchema.safeParse({ version: 1, blocks: [] }).success).toBe(
    false,
  );
  expect(
    editorDocumentSchema.safeParse({
      version: 1,
      blocks: [paragraph, { id: 'intro', type: 'separator' }],
    }).success,
  ).toBe(false);
});

it('rejects oversized and cyclic input before recursive schema evaluation', () => {
  const cycle: unknown[] = [];
  cycle.push(cycle);
  expect(editorDocumentSchema.safeParse({ version: 1, blocks: cycle }).success).toBe(
    false,
  );
  expect(
    editorDocumentSchema.safeParse({
      version: 1,
      blocks: [
        {
          ...paragraph,
          content: [
            { type: 'text', text: 'x'.repeat(EDITOR_POLICY.maxTextLength + 1) },
          ],
        },
      ],
    }).success,
  ).toBe(false);
  expect(
    editorDocumentSchema.safeParse({
      version: 1,
      blocks: [
        {
          ...paragraph,
          content: Array.from({ length: EDITOR_POLICY.maxInlines + 1 }, () => ({
            type: 'hardBreak',
          })),
        },
      ],
    }).success,
  ).toBe(false);
});
