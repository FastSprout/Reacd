import { expect, it } from 'vitest';
import { proseDocumentSchema, proseSchema } from './prose.schema.js';

const heading = {
  type: 'heading',
  level: 2,
  id: 'heading',
  children: [{ type: 'text', text: 'Heading' }],
};
it('accepts the entire closed semantic AST including optional fields', () => {
  expect(
    proseDocumentSchema.safeParse([
      heading,
      {
        type: 'paragraph',
        children: [
          { type: 'strong', children: [{ type: 'text', text: 'Strong' }] },
          { type: 'emphasis', children: [{ type: 'code', text: 'Code' }] },
          { type: 'delete', children: [] },
          { type: 'break' },
          { type: 'link', href: '../guide/', children: [] },
        ],
      },
      {
        type: 'list',
        ordered: true,
        start: 2,
        items: [{ checked: true, children: [{ type: 'paragraph', children: [] }] }],
      },
      { type: 'list', ordered: false, items: [{ children: [] }] },
      { type: 'quote', children: [{ type: 'thematicBreak' }] },
      {
        type: 'code',
        language: 'tsx',
        content: 'x',
        tokens: [[{ text: 'x', light: '#000000', dark: '#ffffff' }]],
      },
      { type: 'code', language: '', content: '' },
      { type: 'table', header: [[]], rows: [[[]]] },
      { type: 'image', src: '/image.svg', alt: 'Image' },
      {
        type: 'image',
        src: 'https://example.com/image.png',
        alt: 'Image',
        title: 'Title',
      },
    ]).success,
  ).toBe(true);
});
it('rejects raw nodes, style escapes and invalid semantic shape', () => {
  for (const document of [
    [{ type: 'html', value: '<script>unsafe()</script>' }],
    [{ ...heading, className: 'custom' }],
    [{ ...heading, level: 7 }],
    [{ ...heading, id: 'unsafe id' }],
    [heading, heading],
    [{ type: 'table', header: [[]], rows: [[[], []]] }],
    [
      {
        type: 'code',
        language: 'tsx',
        content: 'x',
        tokens: [[{ text: 'different', light: '#000000', dark: '#ffffff' }]],
      },
    ],
    [
      {
        type: 'code',
        language: 'tsx',
        content: 'x',
        tokens: [[{ text: 'x', light: 'url(evil)', dark: '#ffffff' }]],
      },
    ],
  ])
    expect(proseDocumentSchema.safeParse(document).success).toBe(false);
  expect(proseSchema.safeParse({ document: [], style: {} }).success).toBe(false);
});
it('keeps literal markup as escaped text rather than an executable node', () => {
  expect(
    proseDocumentSchema.safeParse([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '<script>unsafe()</script>' }],
      },
    ]).success,
  ).toBe(true);
});
