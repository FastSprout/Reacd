import { expect, it, vi } from 'vitest';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { publishEditorDocument } from './publish-edit.js';

it('does not publish controlled snapshots without a valid editable selection', () => {
  const value = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
  });
  const proposed = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'separator', id: 'rule' }],
  });
  const changed = vi.fn();
  expect(
    publishEditorDocument(
      {
        label: 'Notes',
        value,
        selection: {
          anchor: { blockId: 'intro', offset: 0 },
          focus: { blockId: 'intro', offset: 0 },
        },
        onEditChange: changed,
      },
      proposed,
      undefined,
    ),
  ).toBe(false);
  expect(changed).not.toHaveBeenCalled();
});
