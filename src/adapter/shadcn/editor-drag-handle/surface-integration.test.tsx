import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import type { EditorDocument } from '../../../core/editor-document.js';
import type { EditorEdit } from '../../../core/editor-edit.js';
import { ShadcnEditor } from '../editor/editor.adapter.js';
import { ShadcnEditorDragHandle } from './editor-drag-handle.adapter.js';
const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'middle', content: [{ type: 'text', text: 'Middle' }] },
    { type: 'paragraph', id: 'last', content: [{ type: 'text', text: 'Last' }] },
  ],
};
let restore: () => void = () => undefined;
let restoreScroll: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  restoreScroll = () => scroll.mockRestore();
});
afterEach(() => {
  restore();
  restoreScroll();
});
function Host({
  change,
  reject = false,
}: {
  change: (document: EditorDocument) => void;
  reject?: boolean;
}) {
  const [edit, setEdit] = useState<EditorEdit>({
    value: INITIAL,
    selection: {
      anchor: { blockId: 'middle', offset: 0 },
      focus: { blockId: 'middle', offset: 0 },
    },
  });
  return (
    <ShadcnEditor
      label="Reorder document"
      value={edit.value}
      onEditChange={(next) => {
        change(next.value);
        if (!reject) setEdit(next);
      }}
      selection={edit.selection}
      toolbar={<ShadcnEditorDragHandle label="Block" blockId="middle" />}
    />
  );
}
it('uses the genuine editor for atomic keyboard moves and host rejection', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(<Host change={changed} />);
  const box = await screen.findByRole('textbox', { name: 'Reorder document' });
  const up = screen.getByRole('button', { name: 'Block: Move up' });
  await waitFor(() => expect(up).not.toBeDisabled());
  up.focus();
  await user.keyboard('{Enter}');
  await waitFor(() => expect(box.textContent).toBe('MiddleFirstLast'));
  expect(changed).toHaveBeenCalledTimes(1);
  expect(changed.mock.calls[0]).toEqual([
    expect.objectContaining({
      blocks: [INITIAL.blocks[1], INITIAL.blocks[0], INITIAL.blocks[2]],
    }),
  ]);
  await user.click(
    screen.getByRole('button', { name: 'Block: Select and drag block' }),
  );
  await waitFor(() => expect(box).toHaveFocus());
  await user.keyboard('!');
  await waitFor(() => expect(box.textContent).toBe('!MiddleFirstLast'));
  view.unmount();
  changed.mockClear();
  render(<Host change={changed} reject />);
  const rejected = await screen.findByRole('textbox', { name: 'Reorder document' });
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Block: Move up' })).not.toBeDisabled(),
  );
  await user.click(screen.getByRole('button', { name: 'Block: Move up' }));
  expect(changed).toHaveBeenCalledTimes(1);
  expect(rejected.textContent).toBe('FirstMiddleLast');
});
it('selects an editable point inside structural quote and list targets', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const documentModel: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'quote',
        id: 'quote',
        children: [
          {
            type: 'paragraph',
            id: 'quoted',
            content: [{ type: 'text', text: 'Quoted' }],
          },
        ],
      },
      {
        type: 'bulletList',
        id: 'list',
        items: [
          {
            type: 'listItem',
            id: 'item',
            children: [
              {
                type: 'paragraph',
                id: 'listed',
                content: [{ type: 'text', text: 'Listed' }],
              },
            ],
          },
        ],
      },
    ],
  };
  render(
    <ShadcnEditor
      label="Nested document"
      value={documentModel}
      onValueChange={changed}
      toolbar={
        <>
          <ShadcnEditorDragHandle label="Quote" blockId="quote" />
          <ShadcnEditorDragHandle label="List" blockId="list" />
          <ShadcnEditorDragHandle label="Item" blockId="item" />
        </>
      }
    />,
  );
  const box = await screen.findByRole('textbox', { name: 'Nested document' });
  const quote = screen.getByRole('button', { name: 'Quote: Select and drag block' });
  await waitFor(() => expect(quote).not.toBeDisabled());
  await user.click(quote);
  await waitFor(() => expect(box).toHaveFocus());
  await user.keyboard('Q');
  await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
  expect(changed.mock.calls[0]).toEqual([
    expect.objectContaining({
      blocks: [
        expect.objectContaining({
          type: 'quote',
          children: [
            expect.objectContaining({
              content: [{ type: 'text', text: 'QQuoted' }],
            }),
          ],
        }),
        documentModel.blocks[1],
      ],
    }),
  ]);
  await waitFor(() => expect(box.textContent).toBe('QuotedListed'));
  changed.mockClear();
  await user.click(screen.getByRole('button', { name: 'List: Select and drag block' }));
  await waitFor(() => expect(box).toHaveFocus());
  await user.keyboard('L');
  await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
  expect(changed.mock.calls[0]).toEqual([
    expect.objectContaining({
      blocks: [
        documentModel.blocks[0],
        expect.objectContaining({
          items: [
            expect.objectContaining({
              children: [
                expect.objectContaining({
                  content: [{ type: 'text', text: 'LListed' }],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]);
  await waitFor(() => expect(box.textContent).toBe('QuotedListed'));
  changed.mockClear();
  await user.click(screen.getByRole('button', { name: 'Item: Select block' }));
  await waitFor(() => expect(box).toHaveFocus());
  await user.keyboard('I');
  await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
  expect(changed.mock.calls[0]).toEqual([
    expect.objectContaining({
      blocks: [
        documentModel.blocks[0],
        expect.objectContaining({
          items: [
            expect.objectContaining({
              children: [
                expect.objectContaining({
                  content: [{ type: 'text', text: 'IListed' }],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]);
});
it('targets the selected separator rather than its caret neighbor', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const documentModel: EditorDocument = {
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
      { type: 'separator', id: 'rule' },
      { type: 'paragraph', id: 'last', content: [{ type: 'text', text: 'Last' }] },
    ],
  };
  render(
    <ShadcnEditor
      label="Separator document"
      value={documentModel}
      onValueChange={changed}
      toolbar={
        <>
          <ShadcnEditorDragHandle label="Separator" blockId="rule" />
          <ShadcnEditorDragHandle label="Selection" />
        </>
      }
    />,
  );
  const box = await screen.findByRole('textbox', { name: 'Separator document' });
  await user.click(
    screen.getByRole('button', {
      name: 'Separator: Select and drag block',
    }),
  );
  await waitFor(() => expect(box).toHaveFocus());
  await user.click(screen.getByRole('button', { name: 'Selection: Move up' }));
  expect(changed).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      blocks: [
        documentModel.blocks[1],
        documentModel.blocks[0],
        documentModel.blocks[2],
      ],
    }),
  );
});
