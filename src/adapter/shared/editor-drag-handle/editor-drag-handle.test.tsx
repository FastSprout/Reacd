import { render, screen, fireEvent } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { EditorDocument } from '../../../core/editor-document.js';
import { EditorScopeContext } from '../../../renderer/editor/editor-context.js';
import { editorPortFixture } from '../../../../test-support/editor-port.js';
import { SharedEditorDragHandle } from './editor-drag-handle.adapter.js';
const DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'middle', content: [{ type: 'text', text: 'Middle' }] },
    {
      type: 'quote',
      id: 'last',
      children: [
        {
          type: 'paragraph',
          id: 'nested',
          content: [{ type: 'text', text: 'Nested' }],
        },
      ],
    },
  ],
};
function fixture() {
  const selectBlock = vi.fn();
  const moveBlock = vi.fn();
  const beginBlockDrag = vi.fn(() => true);
  const cancelBlockDrag = vi.fn();
  const port = editorPortFixture(DOCUMENT, {
    selectedBlockId: 'middle',
    selectBlock,
    moveBlock,
    beginBlockDrag,
    cancelBlockDrag,
  });
  return { port, selectBlock, moveBlock, beginBlockDrag, cancelBlockDrag };
}
it('selects and moves exact logical values without form submission', async () => {
  const user = userEvent.setup();
  const h = fixture();
  const submitted = vi.fn();
  render(
    <form onSubmit={submitted}>
      <EditorScopeContext.Provider value={h.port}>
        <SharedEditorDragHandle label="Block" />
      </EditorScopeContext.Provider>
    </form>,
  );
  await user.click(
    screen.getByRole('button', { name: 'Block: Select and drag block' }),
  );
  expect(h.selectBlock).toHaveBeenCalledExactlyOnceWith('middle');
  const up = screen.getByRole('button', { name: 'Block: Move up' });
  up.focus();
  await user.keyboard('{Enter}');
  expect(h.moveBlock).toHaveBeenCalledExactlyOnceWith('middle', 'up');
  await user.click(screen.getByRole('button', { name: 'Block: Move down' }));
  expect(h.moveBlock).toHaveBeenLastCalledWith('middle', 'down');
  expect(submitted).not.toHaveBeenCalled();
});
it('resolves nested IDs and rejects unavailable targets', () => {
  const view = render(<SharedEditorDragHandle label="Block" />);
  expect(screen.getByRole('alert')).toHaveTextContent('inside an Editor');
  const port = editorPortFixture(DOCUMENT);
  view.rerender(
    <EditorScopeContext.Provider value={port}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Select an editor block');
  view.rerender(
    <EditorScopeContext.Provider value={port}>
      <SharedEditorDragHandle label="Block" blockId="unknown" />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('does not exist');
  view.rerender(
    <EditorScopeContext.Provider value={port}>
      <SharedEditorDragHandle label="Block" blockId="nested" />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Block: Select block' })).toHaveAttribute(
    'draggable',
    'false',
  );
  expect(screen.getByRole('button', { name: 'Block: Move up' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Block: Move down' })).toBeDisabled();
});
it('starts canonical native sessions and cancels without events', () => {
  const h = fixture();
  const view = render(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  const handle = screen.getByRole('button', { name: 'Block: Select and drag block' });
  const dataTransfer = { effectAllowed: 'none', setData: vi.fn() };
  expect(fireEvent.dragStart(handle, { dataTransfer })).toBe(true);
  expect(h.beginBlockDrag).toHaveBeenCalledExactlyOnceWith('middle');
  expect(dataTransfer.effectAllowed).toBe('move');
  expect(dataTransfer.setData).toHaveBeenCalledExactlyOnceWith(
    'application/x-reacd-editor-block',
    'middle',
  );
  fireEvent.dragEnd(handle);
  expect(h.cancelBlockDrag).toHaveBeenCalledExactlyOnceWith();
  fireEvent.dragEnd(handle);
  expect(h.cancelBlockDrag).toHaveBeenCalledTimes(1);
  fireEvent.dragStart(handle, { dataTransfer });
  view.unmount();
  expect(h.cancelBlockDrag).toHaveBeenCalledTimes(2);
});
it('rejects starts and cleans up native payload failures', () => {
  const h = fixture();
  h.beginBlockDrag.mockReturnValue(false);
  const view = render(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  const handle = screen.getByRole('button', { name: 'Block: Select and drag block' });
  const dataTransfer = { effectAllowed: 'none', setData: vi.fn() };
  expect(fireEvent.dragStart(handle, { dataTransfer })).toBe(false);
  expect(h.cancelBlockDrag).not.toHaveBeenCalled();
  expect(dataTransfer.setData).not.toHaveBeenCalled();
  h.beginBlockDrag.mockReturnValue(true);
  dataTransfer.setData.mockImplementation(() => {
    throw new Error('Unavailable');
  });
  expect(fireEvent.dragStart(handle, { dataTransfer })).toBe(false);
  expect(h.cancelBlockDrag).toHaveBeenCalledExactlyOnceWith();
  view.unmount();
  expect(h.cancelBlockDrag).toHaveBeenCalledTimes(1);
});
it('preserves ownership until Escape or protection', () => {
  const h = fixture();
  const view = render(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  const handle = screen.getByRole('button', { name: 'Block: Select and drag block' });
  const dataTransfer = { effectAllowed: 'none', setData: vi.fn() };
  fireEvent.dragStart(handle, { dataTransfer });
  view.rerender(
    <EditorScopeContext.Provider value={{ ...h.port }}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  expect(h.cancelBlockDrag).not.toHaveBeenCalled();
  fireEvent.keyDown(handle, { key: 'Tab' });
  expect(h.cancelBlockDrag).not.toHaveBeenCalled();
  fireEvent.keyDown(handle, { key: 'Escape' });
  expect(h.cancelBlockDrag).toHaveBeenCalledExactlyOnceWith();
  fireEvent.dragStart(handle, { dataTransfer });
  view.rerender(
    <EditorScopeContext.Provider value={{ ...h.port, disabled: true }}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  expect(h.cancelBlockDrag).toHaveBeenCalledTimes(2);
  const protectedHandle = screen.getByRole('button', { name: 'Block: Select block' });
  expect(protectedHandle).toBeDisabled();
  expect(fireEvent.dragStart(protectedHandle, { dataTransfer })).toBe(false);
  expect(h.beginBlockDrag).toHaveBeenCalledTimes(2);
  view.unmount();
  expect(h.cancelBlockDrag).toHaveBeenCalledTimes(2);
});
it('cancels old ownership before accepting a new session', () => {
  let active: string | undefined;
  const port = editorPortFixture(DOCUMENT, {
    selectedBlockId: 'middle',
    beginBlockDrag: (id) => {
      active = id;
      return true;
    },
    cancelBlockDrag: () => {
      active = undefined;
    },
  });
  const view = render(
    <EditorScopeContext.Provider value={port}>
      <SharedEditorDragHandle label="Block" />
    </EditorScopeContext.Provider>,
  );
  const handle = screen.getByRole('button', { name: 'Block: Select and drag block' });
  const dataTransfer = { effectAllowed: 'none', setData: vi.fn() };
  fireEvent.dragStart(handle, { dataTransfer });
  expect(active).toBe('middle');
  fireEvent.dragStart(handle, { dataTransfer });
  expect(active).toBe('middle');
  view.rerender(
    <EditorScopeContext.Provider value={port}>
      <SharedEditorDragHandle label="Block" blockId="unknown" />
    </EditorScopeContext.Provider>,
  );
  expect(active).toBeUndefined();
  expect(screen.getByRole('alert')).toBeVisible();
});
it('protects locally disabled controls and non-movable block handles', async () => {
  const user = userEvent.setup();
  const h = fixture();
  const view = render(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" disabled />
    </EditorScopeContext.Provider>,
  );
  for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Block: Move up' }));
  expect(h.moveBlock).not.toHaveBeenCalled();
  view.rerender(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" blockId="first" />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Block: Move up' })).toBeDisabled();
  view.rerender(
    <EditorScopeContext.Provider value={h.port}>
      <SharedEditorDragHandle label="Block" blockId="nested" />
    </EditorScopeContext.Provider>,
  );
  expect(
    fireEvent.dragStart(screen.getByRole('button', { name: 'Block: Select block' }), {
      dataTransfer: { setData: vi.fn() },
    }),
  ).toBe(false);
  expect(h.beginBlockDrag).not.toHaveBeenCalled();
});
