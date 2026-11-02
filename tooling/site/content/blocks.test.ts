import { expect, it } from 'vitest';
import { headingAnchor, proseBlocks } from './blocks.js';
import { inlineNodes, inlineText } from './inline.js';

it('handles empty labels and rejects malformed parser nodes', async () => {
  const anchors = new Set<string>();
  expect(headingAnchor('!!!', anchors)).toBe('section');
  expect(headingAnchor('!!!', anchors)).toBe('section-1');
  const context = { definitions: new Map(), headings: [], anchors };
  const blocks = await proseBlocks(
    [
      { type: 'paragraph', children: [{ type: 'image', url: 'logo.svg', alt: null }] },
      {
        type: 'paragraph',
        children: [{ type: 'image', url: 'logo.svg', alt: 'Logo' }],
      },
      { type: 'paragraph', children: [] },
      { type: 'list', children: [{ type: 'listItem', children: [] }] },
      { type: 'code', value: 'plain text' },
    ],
    context,
  );
  expect(blocks[0]).toEqual({ type: 'image', src: 'logo.svg', alt: '' });
  expect(blocks[1]).toEqual({ type: 'image', src: 'logo.svg', alt: 'Logo' });
  expect(blocks[3]).toMatchObject({ type: 'list', ordered: false });
  await expect(proseBlocks([{ type: 'table', children: [] }], context)).rejects.toThrow(
    'header',
  );
  expect(() =>
    inlineNodes(
      [
        {
          type: 'linkReference',
          identifier: 'missing',
          referenceType: 'full',
          children: [],
        },
      ],
      new Map(),
    ),
  ).toThrow('Unknown link reference');
  expect(inlineText([{ type: 'break' }])).toBe('\n');
});
