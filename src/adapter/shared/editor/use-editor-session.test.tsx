import { act, renderHook, waitFor } from '../../../../test-support/adapter-testing.js';
import { Slice } from '@tiptap/pm/model';
import { expect, it, vi } from 'vitest';
import type { EditorProps } from '../../../components/editor/index.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { EDITOR_NATIVE_POLICY } from '../../../core/editor-native-policy.js';
import { useEditorSession } from './use-editor-session.js';

const value = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Text' }] },
  ],
});
class EmptyClipboardEvent extends Event implements ClipboardEvent {
  readonly clipboardData = null;
  constructor() {
    super('paste');
  }
}
class NativeDropEvent extends MouseEvent implements DragEvent {
  readonly dataTransfer = null;
  constructor() {
    super('drop', { clientY: 1 });
  }
}

it('guards SDK output, budgets and unsupported atomic selections', async () => {
  const changed = vi.fn();
  const initial: EditorProps = { label: 'Notes', value, onValueChange: changed };
  const { result, rerender } = renderHook<
    ReturnType<typeof useEditorSession>,
    EditorProps
  >((props: EditorProps) => useEditorSession(props, 'test-editor'), {
    initialProps: initial,
  });
  await waitFor(() => expect(result.current.ready).toBe(true));
  const editor = result.current.editor;
  if (editor === null) throw new Error('Expected initialized SDK fixture.');
  act(() => {
    editor.commands.setContent({
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { reacdId: 'code', language: 'unsupported' },
          content: [{ type: 'text', text: 'Code' }],
        },
      ],
    });
  });
  expect(result.current.issue).toContain('bounded supported');
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('Text');
  act(() => {
    editor.commands.insertContent({
      type: 'text',
      text: 'x'.repeat(EDITOR_POLICY.maxCharacters + 1),
    });
  });
  expect(result.current.issue).toContain('content limits');
  expect(changed).not.toHaveBeenCalled();
  rerender({
    label: 'Notes',
    value,
    selection: {
      anchor: { blockId: 'intro', offset: 0 },
      focus: { blockId: 'intro', offset: 0 },
    },
    onEditChange: changed,
  });
  act(() => {
    editor.commands.setContent({
      type: 'doc',
      content: [{ type: 'horizontalRule', attrs: { reacdId: 'rule' } }],
    });
  });
  expect(result.current.issue).toContain('editable logical selection');
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('Text');
});

it('guards protected hooks and empty native clipboards', async () => {
  const changed = vi.fn();
  const initial: EditorProps = {
    label: 'Notes',
    value,
    onValueChange: changed,
    readOnly: true,
  };
  const { result, rerender } = renderHook<
    ReturnType<typeof useEditorSession>,
    EditorProps
  >((props: EditorProps) => useEditorSession(props, 'test-editor'), {
    initialProps: initial,
  });
  await waitFor(() => expect(result.current.ready).toBe(true));
  const editor = result.current.editor;
  if (editor === null) throw new Error('Expected initialized SDK fixture.');
  act(() => {
    expect(
      editor.options.editorProps.handlePaste?.(
        editor.view,
        new EmptyClipboardEvent(),
        Slice.empty,
      ),
    ).toBe(true);
    expect(
      editor.options.editorProps.handleDrop?.(
        editor.view,
        new NativeDropEvent(),
        Slice.empty,
        false,
      ),
    ).toBe(true);
    editor.commands.insertContent({ type: 'text', text: 'Rejected native command' });
    editor.commands.setTextSelection(2);
  });
  expect(changed).not.toHaveBeenCalled();
  rerender({ label: 'Notes', value, onValueChange: changed });
  act(() => {
    expect(
      editor.options.editorProps.handlePaste?.(
        editor.view,
        new EmptyClipboardEvent(),
        Slice.empty,
      ),
    ).toBe(true);
    editor
      .chain()
      .setMeta(EDITOR_NATIVE_POLICY.controlledTransaction, true)
      .setContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { reacdId: 'other' },
            content: [{ type: 'text', text: 'Internal' }],
          },
        ],
      })
      .run();
  });
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('Text');
});
