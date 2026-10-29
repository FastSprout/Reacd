import { act, renderHook, waitFor } from '@testing-library/react';
import { Slice } from '@tiptap/pm/model';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { EditorProps } from '../../../components/editor/index.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { editorSelectionSchema } from '../../../schema/editor/document/index.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import {
  sdkBlockPosition,
  selectedSdkBlockId,
} from '../editor-sdk/structural-selection.js';
import { sdkSelectionToDomain } from '../editor-sdk/selection-mapping.js';
import { useEditorSession } from './use-editor-session.js';

const VALUE = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'separator', id: 'rule' },
    { type: 'paragraph', id: 'last', content: [{ type: 'text', text: 'Last' }] },
  ],
});
class ScopedDropEvent extends MouseEvent implements DragEvent {
  readonly dataTransfer = null;
  constructor(private readonly dropTarget: EventTarget | null) {
    super('drop', { clientY: 1 });
  }
  override get target(): EventTarget | null {
    return this.dropTarget;
  }
}
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
});
afterEach(() => {
  restore();
  vi.restoreAllMocks();
});

it('accepts local drops and guards invalid targets and protection', async () => {
  const changed = vi.fn();
  const initial: EditorProps = {
    label: 'Notes',
    value: VALUE,
    onValueChange: changed,
  };
  const view = renderHook<ReturnType<typeof useEditorSession>, EditorProps>(
    (props) => useEditorSession(props, 'drop-session-editor'),
    { initialProps: initial },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  function drop(target: EventTarget | null): void {
    expect(
      editor?.options.editorProps.handleDrop?.(
        editor.view,
        new ScopedDropEvent(target),
        Slice.empty,
        false,
      ),
    ).toBe(true);
  }
  const first = editor.view.dom.querySelector('[data-reacd-block="first"]');
  const last = editor.view.dom.querySelector('[data-reacd-block="last"]');
  if (first === null || last === null) throw new Error('Expected native blocks.');
  act(() => {
    drop(last);
    view.result.current.drag.begin(VALUE, 'first');
    drop(null);
    view.result.current.drag.begin(VALUE, 'first');
    drop(document.createElement('p'));
    view.result.current.drag.begin(VALUE, 'first');
    drop(first);
  });
  expect(changed).not.toHaveBeenCalled();
  act(() => {
    expect(view.result.current.drag.begin(VALUE, 'first')).toBe(true);
    drop(last);
  });
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    version: 1,
    blocks: [VALUE.blocks[1], VALUE.blocks[2], VALUE.blocks[0]],
  });
  changed.mockClear();
  act(() => drop(last));
  expect(changed).not.toHaveBeenCalled();
  expect(view.result.current.drag.begin(VALUE, 'first')).toBe(true);
  view.rerender({ ...initial, readOnly: true });
  act(() => drop(last));
  expect(changed).not.toHaveBeenCalled();
  expect(
    view.result.current.drag.drop(VALUE, last, 1, editor.view.dom),
  ).toBeUndefined();
});

it('preserves node selection across host reorder and removal', async () => {
  const changed = vi.fn();
  const initial: EditorProps = {
    label: 'Notes',
    value: VALUE,
    onValueChange: changed,
  };
  const view = renderHook<ReturnType<typeof useEditorSession>, EditorProps>(
    (props) => useEditorSession(props, 'structural-host-editor'),
    { initialProps: initial },
  );
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  const editor = view.result.current.editor;
  if (editor === null) throw new Error('Expected native editor.');
  const position = sdkBlockPosition(editor.state.doc, 'rule');
  if (position === undefined) throw new Error('Expected native rule.');
  act(() => {
    editor.commands.setNodeSelection(position);
  });
  expect(selectedSdkBlockId(editor.state.selection)).toBe('rule');
  const moved = editorDocumentSchema.parse({
    version: 1,
    blocks: [VALUE.blocks[1], VALUE.blocks[0], VALUE.blocks[2]],
  });
  view.rerender({ ...initial, value: moved });
  expect(selectedSdkBlockId(editor.state.selection)).toBe('rule');
  expect(editor.state.selection.from).toBe(0);
  const replaced = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'replacement',
        content: [{ type: 'text', text: 'Replacement' }],
      },
    ],
  });
  view.rerender({ ...initial, value: replaced });
  expect(selectedSdkBlockId(editor.state.selection)).toBeUndefined();
  const selection = sdkSelectionToDomain(editor.state.doc, editor.state.selection);
  expect(editorSelectionSchema(replaced).safeParse(selection).success).toBe(true);
  expect(selection?.focus.blockId).toBe('replacement');
  expect(changed).not.toHaveBeenCalled();
});
