import { expect, it } from 'vitest';
import { editorEditSchema } from './edit.schema.js';

const value = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Draft' }] },
    { type: 'paragraph', id: 'end', content: [] },
  ],
};
const selection = {
  anchor: { blockId: 'intro', offset: 5 },
  focus: { blockId: 'end', offset: 0 },
};

it('validates an immutable atomic edit against its actual document', () => {
  const edit = editorEditSchema.parse({ value, selection });
  expect(edit).toEqual({ value, selection });
  expect(Object.isFrozen(edit)).toBe(true);
  expect(Object.isFrozen(edit.value)).toBe(true);
  expect(Object.isFrozen(edit.selection)).toBe(true);
  expect(edit.value).not.toBe(value);
});

it.each([
  { ...selection, anchor: { blockId: 'otherDocument', offset: 0 } },
  { ...selection, focus: { blockId: 'intro', offset: 6 } },
])('rejects a selection that cannot resolve to this edit document', (invalid) => {
  const result = editorEditSchema.safeParse({ value, selection: invalid });
  expect(result.success).toBe(false);
  if (result.success) throw new Error('Expected invalid atomic editor selection.');
  expect(result.error.issues).toContainEqual(
    expect.objectContaining({
      message: 'Editor selection must resolve to this document.',
    }),
  );
});
