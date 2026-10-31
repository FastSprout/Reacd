import { expect, it } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorTextChunks } from './text-chunks.js';

it('splits canonical text without cutting a Unicode surrogate pair', () => {
  const prefix = 'a'.repeat(EDITOR_POLICY.maxTextLength - 1);
  const text = `${prefix}😀b`;
  const chunks = [...editorTextChunks(text)].map(({ from, to }) =>
    text.slice(from, to),
  );
  expect(chunks).toEqual([prefix, '😀b']);
  expect(chunks.join('')).toBe(text);
  expect([...editorTextChunks('')]).toEqual([]);
  expect([...editorTextChunks('Plain text')]).toEqual([{ from: 0, to: 10 }]);
});
