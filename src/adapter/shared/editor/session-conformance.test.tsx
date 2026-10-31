import {
  act,
  fireEvent,
  renderHook,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import type { EditorProps } from '../../../components/editor/index.js';
import { EDITOR_NATIVE_POLICY } from '../../../core/editor-native-policy.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { useEditorSession } from './use-editor-session.js';

const VALUE = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'second', content: [{ type: 'text', text: 'Second' }] },
  ],
});
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
});
afterEach(() => {
  restore();
  vi.restoreAllMocks();
});
function paste(target: HTMLElement, text: string) {
  fireEvent.paste(target, {
    clipboardData: { getData: (type: string) => (type === 'text/plain' ? text : '') },
  });
}

it('keeps stored paste marks and ignores empty payloads', async () => {
  const changed = vi.fn();
  const initial: EditorProps = { label: 'Notes', value: VALUE, onValueChange: changed };
  const view = renderHook(
    (props: EditorProps) => useEditorSession(props, 'paste-mark-editor'),
    { initialProps: initial },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  act(() => {
    editor.commands.setTextSelection(1);
    editor.commands.setMark('bold');
    paste(editor.view.dom, 'A\nB');
  });
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'first',
        content: [
          { type: 'text', text: 'A', marks: ['bold'] },
          { type: 'hardBreak' },
          { type: 'text', text: 'B', marks: ['bold'] },
          { type: 'text', text: 'First' },
        ],
      },
      VALUE.blocks[1],
    ],
  });
  changed.mockClear();
  act(() => paste(editor.view.dom, ''));
  expect(changed).not.toHaveBeenCalled();
  view.unmount();
  expect(editor.isDestroyed).toBe(true);
});

it('inherits marks and preserves native code paste newlines', async () => {
  const changed = vi.fn();
  const marked = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'marked',
        content: [{ type: 'text', text: 'First', marks: ['italic'] }],
      },
    ],
  });
  const initial: EditorProps = {
    label: 'Notes',
    value: marked,
    onValueChange: changed,
  };
  const view = renderHook<ReturnType<typeof useEditorSession>, EditorProps>(
    (props) => useEditorSession(props, 'inherit-mark-editor'),
    { initialProps: initial },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  act(() => {
    editor.commands.setTextSelection(2);
    editor.view.dispatch(editor.state.tr.setStoredMarks(null));
    paste(editor.view.dom, 'X');
  });
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'marked',
        content: [{ type: 'text', text: 'FXirst', marks: ['italic'] }],
      },
    ],
  });
  const code = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'codeBlock', id: 'source', text: '', language: 'plain' }],
  });
  changed.mockClear();
  view.rerender({ label: 'Code', value: code, onValueChange: changed });
  act(() => paste(editor.view.dom, 'line one\r\nline two'));
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    version: 1,
    blocks: [
      {
        type: 'codeBlock',
        id: 'source',
        text: 'line one\nline two',
        language: 'plain',
      },
    ],
  });
});

it('protects hidden and disabled hooks without host writes', async () => {
  let active = true;
  const changed = vi.fn();
  const initial: EditorProps = {
    label: 'Notes',
    value: VALUE,
    onValueChange: changed,
  };
  const view = renderHook<ReturnType<typeof useEditorSession>, EditorProps>(
    (props) => useEditorSession(props, 'hidden-editor'),
    {
      initialProps: initial,
      wrapper: ({ children }: { children: ReactNode }) => (
        <PortalActiveContext value={active}>{children}</PortalActiveContext>
      ),
    },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  active = false;
  view.rerender(initial);
  expect(view.result.current.protectedView).toBe(true);
  expect(editor.isEditable).toBe(false);
  act(() => {
    paste(editor.view.dom, 'Hidden');
    editor.commands.insertContent({ type: 'text', text: 'Private command' });
    editor.commands.setTextSelection(3);
  });
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('First\n\nSecond');
  active = true;
  view.rerender({ ...initial, disabled: true });
  act(() => {
    editor.commands.setTextSelection(2);
  });
  expect(changed).not.toHaveBeenCalled();
  view.rerender(initial);
  expect(editor.isEditable).toBe(true);
  expect(changed).not.toHaveBeenCalled();
});

it('rejects selection-only snapshots of stale documents', async () => {
  const changed = vi.fn();
  const selection = {
    anchor: { blockId: 'first', offset: 0 },
    focus: { blockId: 'first', offset: 0 },
  };
  const initial: EditorProps = {
    label: 'Notes',
    value: VALUE,
    selection,
    onEditChange: changed,
  };
  const view = renderHook(
    (props: EditorProps) => useEditorSession(props, 'atomic-selection-editor'),
    { initialProps: initial },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  act(() => {
    editor.view.dispatch(
      editor.state.tr
        .insertText('X', 1)
        .setMeta(EDITOR_NATIVE_POLICY.controlledTransaction, true),
    );
    editor.commands.setTextSelection(3);
  });
  expect(changed).not.toHaveBeenCalled();
  expect(editor.getText()).toBe('First\n\nSecond');
  act(() => {
    editor.commands.setTextSelection(3);
    editor.commands.setTextSelection(1);
  });
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    value: VALUE,
    selection: {
      anchor: { blockId: 'first', offset: 2 },
      focus: { blockId: 'first', offset: 2 },
    },
  });
  expect(editor.state.selection.anchor).toBe(1);
});
