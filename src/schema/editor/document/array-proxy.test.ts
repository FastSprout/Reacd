import { expect, it } from 'vitest';
import { editorDocumentSchema } from './document.schema.js';

it('rejects array proxies without executing their property-read traps', () => {
  let reads = 0;
  const get = () => {
    reads += 1;
    throw new Error('Untrusted property read must not execute.');
  };
  const blocks = new Proxy(
    [{ type: 'paragraph', id: 'intro', content: [] }],
    { get },
  );
  expect(editorDocumentSchema.safeParse({ version: 1, blocks }).success).toBe(false);
  expect(reads).toBe(0);
});
