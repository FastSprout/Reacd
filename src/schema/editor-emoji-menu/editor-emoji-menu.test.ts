import { expect, it } from 'vitest';
import { editorEmojiMenuSchema } from './editor-emoji-menu.schema.js';

it('accepts bounded Unicode and rejects duplicate names or markup', () => {
  expect(
    editorEmojiMenuSchema.safeParse({
      label: 'Emoji',
      items: [{ name: 'wave', value: '👋', label: 'Wave' }],
    }).success,
  ).toBe(true);
  for (const items of [
    [{ name: 'wave', value: 'x'.repeat(33), label: 'Wave' }],
    [
      { name: 'wave', value: '👋', label: 'One' },
      { name: 'wave', value: '👋', label: 'Two' },
    ],
    [{ name: 'wave', value: '👋', label: 'Wave', src: '/image.svg' }],
  ])
    expect(editorEmojiMenuSchema.safeParse({ label: 'Emoji', items }).success).toBe(
      false,
    );
});
