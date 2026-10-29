import { expect, it } from 'vitest';
import { editorToolbarSchema } from './editor-toolbar.schema.js';

it('rejects empty command lists instead of creating an empty keyboard toolbar', () => {
  expect(editorToolbarSchema.safeParse({ items: [] }).success).toBe(false);
  expect(editorToolbarSchema.safeParse({}).success).toBe(true);
});
