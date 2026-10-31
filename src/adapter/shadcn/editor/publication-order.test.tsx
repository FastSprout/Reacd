import { useState } from 'react';
import { atom, Provider, useAtom } from 'jotai';
import { userEvent } from '@testing-library/user-event';
import { ShadcnEditor } from './editor.adapter.js';
import { ShadcnEditorEmojiMenu } from
  '../editor-emoji-menu/editor-emoji-menu.adapter.js';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { Editor } from '@tiptap/core';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { useEditorSession } from './use-editor-session.js';

const initial = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'query',
      content: [{ type: 'text', text: ':missing' }],
    },
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

function nativeEditor(editor: Editor | null) {
  if (editor === null) throw new Error('Expected an initialized editor.');
  return editor;
}

it('publishes native clear before hydrating controlled props', async () => {
  const changed = vi.fn();
  const view = renderHook(() => {
    const [value, setValue] = useState(initial);
    return useEditorSession(
      {
        label: 'Emoji',
        value,
        onValueChange: (next) => {
          changed(next);
          setValue(next);
        },
      },
      'publication-editor',
    );
  });
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = nativeEditor(view.result.current.editor);
  const paragraph = editor.view.dom.querySelector('p');
  if (paragraph === null) throw new Error('Expected the native paragraph.');
  paragraph.textContent = '';
  view.rerender();
  await waitFor(() =>
    expect(changed).toHaveBeenCalledExactlyOnceWith({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'query', content: [] }],
    }),
  );
  expect(editor.getText()).toBe('');
  editor.commands.insertContent(':wa');
  await waitFor(() => expect(editor.getText()).toBe(':wa'));
  expect(changed).toHaveBeenLastCalledWith({
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'query', content: [{ type: 'text', text: ':wa' }] },
    ],
  });
});

it('publishes mounted native clears before the next emoji token', async () => {
  const valueAtom = atom(initial);
  const changed = vi.fn();
  function Controlled() {
    const [value, setValue] = useAtom(valueAtom);
    return (
      <ShadcnEditor
        label="Emoji"
        value={value}
        onValueChange={(next) => {
          changed(next);
          setValue(next);
        }}
      >
        <ShadcnEditorEmojiMenu
          label="Emoji choices"
          items={[{ name: 'wave', value: '👋', label: 'Wave' }]}
        />
      </ShadcnEditor>
    );
  }
  render(
    <Provider>
      <Controlled />
    </Provider>,
  );
  const box = await screen.findByRole('textbox', { name: 'Emoji' });
  box.focus();
  await userEvent.keyboard('{Escape}');
  const paragraph = box.querySelector('p');
  if (paragraph === null) throw new Error('Expected the native paragraph.');
  paragraph.textContent = '';
  box.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'deleteContentBackward',
    }),
  );
  await waitFor(() =>
    expect(changed).toHaveBeenCalledExactlyOnceWith({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'query', content: [] }],
    }),
  );
  await userEvent.keyboard(':wa');
  await screen.findByRole('option', { name: 'Wave' });
  expect(box.textContent).toBe(':wa');
});

it.each([false, true])(
  'publishes cloned values before commits; stored marks: %s',
  async (storedMarks) => {
    const changed = vi.fn();
    const view = renderHook(() => {
      const [value, setValue] = useState(initial);
      return useEditorSession(
        {
          label: 'Emoji',
          value: editorDocumentSchema.parse(value),
          onValueChange: (next) => {
            changed(next);
            setValue(next);
          },
        },
        'interrupted-editor',
      );
    });
    await waitFor(() => expect(view.result.current.ready).toBe(true));
    const editor = nativeEditor(view.result.current.editor);
    let committing = false;
    editor.on('transaction', ({ transaction }) => {
      if (!transaction.docChanged || committing) return;
      committing = true;
      view.rerender();
      committing = false;
    });
    const transaction = editor.state.tr.delete(1, 9);
    if (storedMarks) transaction.setStoredMarks([]);
    editor.view.dispatch(transaction);
    expect(changed).toHaveBeenCalledExactlyOnceWith({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'query', content: [] }],
    });
    await waitFor(() => expect(editor.getText()).toBe(''));
  },
);

it('refreshes stored marks and selection without document writes', async () => {
  const changed = vi.fn();
  const view = renderHook(() => {
    const session = useEditorSession(
      {
        label: 'Notes',
        value: initial,
        onValueChange: changed,
      },
      'selection-refresh-editor',
    );
    return {
      ...session,
      bold: session.editor?.isActive('bold'),
      position: session.editor?.state.selection.anchor,
    };
  });
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = nativeEditor(view.result.current.editor);
  await act(() => editor.commands.setMark('bold'));
  expect(view.result.current.bold).toBe(true);
  await act(() => editor.commands.unsetMark('bold'));
  expect(view.result.current.bold).toBe(false);
  await act(() => editor.commands.setTextSelection(4));
  expect(view.result.current.position).toBe(4);
  expect(changed).not.toHaveBeenCalled();
});

it('retains native select-all deletion and controlled veto rollback', async () => {
  const changed = vi.fn();
  render(<ShadcnEditor label="Veto" value={initial} onValueChange={changed} />);
  const box = await screen.findByRole('textbox', { name: 'Veto' });
  box.focus();
  await userEvent.keyboard('{Control>}a{/Control}{Delete}');
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    version: 1,
    blocks: [{ type: 'paragraph', id: 'block-1', content: [] }],
  });
  await waitFor(() => expect(box.textContent).toBe(':missing'));
});

it('preserves pending browser select-all across a no-op transaction', async () => {
  const view = renderHook(() =>
    useEditorSession(
      {
        label: 'Notes',
        value: editorDocumentSchema.parse(initial),
        onValueChange: vi.fn(),
      },
      'pending-selection-editor',
    ),
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = nativeEditor(view.result.current.editor);
  document.body.append(editor.view.dom);
  try {
    editor.view.dom.focus();
    const range = document.createRange();
    range.selectNodeContents(editor.view.dom);
    const selection = document.getSelection();
    if (selection === null) throw new Error('Expected native selection.');
    selection.removeAllRanges();
    selection.addRange(range);
    expect(selection.toString()).toBe(':missing');
    expect(editor.state.selection.empty).toBe(true);
    act(() => editor.view.dispatch(editor.state.tr));
    view.rerender();
    expect(selection.toString()).toBe(':missing');
    expect(selection.isCollapsed).toBe(false);
  } finally {
    editor.view.dom.remove();
  }
});
