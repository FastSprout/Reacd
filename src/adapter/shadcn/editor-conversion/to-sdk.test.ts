import { expect, it } from 'vitest';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { editorDocumentToSdk } from './to-sdk.js';

it('converts closed blocks and inline metadata without authoring HTML', () => {
  const document = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [
          { type: 'text', text: 'Bold', marks: ['bold'], link: '/reference' },
          { type: 'text', text: 'Plain' },
          { type: 'hardBreak' },
          { type: 'mention', id: 'person', label: 'Example person' },
          { type: 'emoji', name: 'wave', value: '👋' },
        ],
      },
      { type: 'heading', id: 'title', level: 2, content: [] },
      {
        type: 'codeBlock',
        id: 'code',
        text: '<script>Example data</script>',
        language: 'typescript',
      },
      { type: 'codeBlock', id: 'emptyCode', text: '' },
      {
        type: 'quote',
        id: 'quote',
        children: [{ type: 'paragraph', id: 'quoteText', content: [] }],
      },
      {
        type: 'orderedList',
        id: 'numbered',
        start: 3,
        items: [
          {
            type: 'listItem',
            id: 'number',
            children: [{ type: 'paragraph', id: 'numberText', content: [] }],
          },
        ],
      },
      {
        type: 'bulletList',
        id: 'bullets',
        items: [
          {
            type: 'listItem',
            id: 'bullet',
            children: [{ type: 'paragraph', id: 'bulletText', content: [] }],
          },
        ],
      },
      { type: 'separator', id: 'separator' },
    ],
  });
  const sdk = editorDocumentToSdk(document);
  expect(sdk.type).toBe('doc');
  expect(sdk.content?.map((block) => block.type)).toEqual([
    'paragraph',
    'heading',
    'codeBlock',
    'codeBlock',
    'blockquote',
    'orderedList',
    'bulletList',
    'horizontalRule',
  ]);
  expect(sdk.content?.[0]).toEqual({
    type: 'paragraph',
    attrs: { reacdId: 'intro' },
    content: [
      {
        type: 'text',
        text: 'Bold',
        marks: [{ type: 'bold' }, { type: 'link', attrs: { href: '/reference' } }],
      },
      { type: 'text', text: 'Plain' },
      { type: 'hardBreak' },
      { type: 'reacdMention', attrs: { id: 'person', label: 'Example person' } },
      { type: 'reacdEmoji', attrs: { name: 'wave', value: '👋' } },
    ],
  });
  expect(sdk.content?.[2]).toEqual({
    type: 'codeBlock',
    attrs: { reacdId: 'code', language: 'typescript' },
    content: [{ type: 'text', text: '<script>Example data</script>' }],
  });
  expect(sdk.content?.[3]).toEqual({
    type: 'codeBlock',
    attrs: { reacdId: 'emptyCode' },
    content: [],
  });
  expect(sdk.content?.slice(4)).toEqual([
    {
      type: 'blockquote',
      attrs: { reacdId: 'quote' },
      content: [{ type: 'paragraph', attrs: { reacdId: 'quoteText' }, content: [] }],
    },
    {
      type: 'orderedList',
      attrs: { reacdId: 'numbered', start: 3 },
      content: [
        {
          type: 'listItem',
          attrs: { reacdId: 'number' },
          content: [
            { type: 'paragraph', attrs: { reacdId: 'numberText' }, content: [] },
          ],
        },
      ],
    },
    {
      type: 'bulletList',
      attrs: { reacdId: 'bullets' },
      content: [
        {
          type: 'listItem',
          attrs: { reacdId: 'bullet' },
          content: [
            { type: 'paragraph', attrs: { reacdId: 'bulletText' }, content: [] },
          ],
        },
      ],
    },
    { type: 'horizontalRule', attrs: { reacdId: 'separator' } },
  ]);
});
