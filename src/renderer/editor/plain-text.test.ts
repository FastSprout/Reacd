import { expect, it } from 'vitest';
import { editorDocumentSchema } from '../../schema/editor/document/index.js';
import { editorPlainText } from './plain-text.js';

it('projects all closed blocks and atoms as ordered escaped plain text', () => {
  const document = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'heading',
        id: 'title',
        level: 1,
        content: [
          { type: 'text', text: '<script>Literal</script>' },
          { type: 'hardBreak' },
          { type: 'mention', id: 'person', label: 'Example person' },
          { type: 'emoji', name: 'wave', value: '👋' },
        ],
      },
      { type: 'codeBlock', id: 'code', text: 'Code' },
      {
        type: 'quote',
        id: 'quote',
        children: [
          {
            type: 'paragraph',
            id: 'quoted',
            content: [{ type: 'text', text: 'Quote' }],
          },
        ],
      },
      {
        type: 'bulletList',
        id: 'bullets',
        items: [
          {
            type: 'listItem',
            id: 'item',
            children: [
              {
                type: 'paragraph',
                id: 'itemText',
                content: [{ type: 'text', text: 'Bullet' }],
              },
            ],
          },
        ],
      },
      {
        type: 'orderedList',
        id: 'ordered',
        start: 1,
        items: [
          {
            type: 'listItem',
            id: 'number',
            children: [
              {
                type: 'paragraph',
                id: 'numberText',
                content: [{ type: 'text', text: 'Number' }],
              },
            ],
          },
        ],
      },
      { type: 'separator', id: 'separator' },
    ],
  });
  expect(editorPlainText(document)).toBe(
    '<script>Literal</script>\n@Example person👋\nCode\nQuote\nBullet\nNumber\n',
  );
});
