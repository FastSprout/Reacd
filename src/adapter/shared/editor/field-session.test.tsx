import { act, renderHook, waitFor } from '../../../../test-support/adapter-testing.js';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { EditorProps } from '../../../components/editor/index.js';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { useEditorSession } from './use-editor-session.js';

const value = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Start' }] },
  ],
});
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

it('blocks inherited atomic edits and selection, then reenables quietly', async () => {
  let blocked = true;
  let error = 'Server rejected';
  const changed = vi.fn();
  const properties: EditorProps = {
    label: 'Notes',
    value,
    disabled: false,
    selection: {
      anchor: { blockId: 'intro', offset: 2 },
      focus: { blockId: 'intro', offset: 2 },
    },
    onEditChange: changed,
  };
  const view = renderHook(
    (props: EditorProps) => useEditorSession(props, 'inherited-editor'),
    {
      initialProps: properties,
      wrapper: ({ children }: { children: ReactNode }) => (
        <FieldMetadataContext
          value={{
            name: 'ignored',
            required: true,
            disabled: blocked,
            error,
            descriptionIds: ['group-description', 'group-description'],
          }}
        >
          {children}
        </FieldMetadataContext>
      ),
    },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native SDK.');
  expect(view.result.current.properties.disabled).toBe(true);
  expect(editor.view.dom).toHaveAttribute(
    'aria-describedby',
    'group-description inherited-editor-description',
  );
  act(() => {
    editor.commands.setTextSelection(2);
    editor.commands.insertContent({ type: 'text', text: 'Rejected' });
  });
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('Start');
  blocked = false;
  error = '';
  view.rerender(properties);
  expect(editor.isEditable).toBe(true);
  expect(editor.view.dom).toHaveAttribute('aria-invalid', 'false');
  expect(editor.state.selection.anchor).toBe(3);
  expect(changed).not.toHaveBeenCalled();
  view.rerender({ ...properties, readOnly: true });
  expect(editor.isEditable).toBe(false);
  expect(editor.view.dom).toHaveAttribute('aria-readonly', 'true');
  expect(editor.view.dom).toHaveAttribute('aria-disabled', 'false');
  expect(changed).not.toHaveBeenCalled();
});
