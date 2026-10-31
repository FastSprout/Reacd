import { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import type { EditorDocument } from '../../../core/editor-document.js';
import { editorEditSchema } from '../../../schema/editor/edit.schema.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { SharedEditorToolbar } from '../editor-toolbar/editor-toolbar.adapter.js';
import { SharedEditor } from './editor.adapter.js';

const initial = editorDocumentSchema.parse({
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
function selectText(box: HTMLElement, start: number, end = start) {
  const text = box.querySelector('p')?.firstChild;
  if (text === null || text === undefined) throw new Error('Missing text fixture.');
  box.focus();
  const range = document.createRange();
  range.setStart(text, start);
  range.setEnd(text, end);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  fireEvent(document, new Event('selectionchange'));
}
function Controlled({ change = (_value: EditorDocument) => undefined }) {
  const [value, setValue] = useState(initial);
  return (
    <SharedEditor
      label="Notes"
      value={value}
      onValueChange={(next) => {
        change(next);
        setValue(next);
      }}
      toolbar={
        <SharedEditorToolbar
          items={[{ command: 'bold' }, { command: 'undo' }, { command: 'redo' }]}
        />
      }
    />
  );
}

it('initializes quietly and publishes validated typing with stable ids', async () => {
  const change = vi.fn();
  render(<Controlled change={change} />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  expect(change).not.toHaveBeenCalled();
  selectText(box, 'Start'.length);
  await userEvent.keyboard('!');
  await waitFor(() => expect(box.textContent).toBe('Start!'));
  const next: unknown = change.mock.lastCall?.[0];
  expect(editorDocumentSchema.safeParse(next).success).toBe(true);
  expect(next).toEqual({
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Start!' }] },
    ],
  });
  expect(Object.isFrozen(next)).toBe(true);
});

it('restores rejected native edits without publishing reconciliation', async () => {
  const change = vi.fn();
  render(<SharedEditor label="Notes" value={initial} onValueChange={change} />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  selectText(box, 'Start'.length);
  await userEvent.keyboard('!');
  await waitFor(() => expect(change).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(box.textContent).toBe('Start'));
});

it('formats through the nearest toolbar and restores undo and redo', async () => {
  render(<Controlled />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  selectText(box, 0, 'Start'.length);
  await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
  await waitFor(() => expect(box.querySelector('strong')?.textContent).toBe('Start'));
  await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
  await waitFor(() => expect(box.querySelector('strong')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Redo' }));
  await waitFor(() => expect(box.querySelector('strong')?.textContent).toBe('Start'));
});

it('blocks native changes in protected and hidden retained scopes', async () => {
  const change = vi.fn();
  const view = render(
    <SharedEditor label="Notes" value={initial} onValueChange={change} readOnly />,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  expect(box).toHaveAttribute('contenteditable', 'false');
  expect(box).toHaveAttribute('aria-readonly', 'true');
  view.rerender(
    <PortalActiveContext value={false}>
      <SharedEditor label="Notes" value={initial} onValueChange={change} />
    </PortalActiveContext>,
  );
  const hidden = await screen.findByRole('textbox', { name: 'Notes' });
  await waitFor(() => expect(hidden).toHaveAttribute('contenteditable', 'false'));
  fireEvent.paste(hidden, { clipboardData: { getData: () => 'Unwanted' } });
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <SharedEditor label="Notes" value={initial} onValueChange={change} disabled />,
  );
  expect(await screen.findByRole('textbox', { name: 'Notes' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});

it('renders host replacements without reporting a user edit', async () => {
  const change = vi.fn();
  const view = render(
    <SharedEditor label="Notes" value={initial} onValueChange={change} />,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  const next = editorDocumentSchema.parse({
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'next', content: [{ type: 'text', text: 'External' }] },
    ],
  });
  await act(async () =>
    view.rerender(<SharedEditor label="Notes" value={next} onValueChange={change} />),
  );
  expect(box.textContent).toBe('External');
  expect(change).not.toHaveBeenCalled();
});

it('restores rejected atomic selection requests and initializes quietly', async () => {
  const change = vi.fn();
  render(
    <SharedEditor
      label="Notes"
      value={initial}
      selection={{
        anchor: { blockId: 'intro', offset: 5 },
        focus: { blockId: 'intro', offset: 5 },
      }}
      onEditChange={change}
    />,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  expect(change).not.toHaveBeenCalled();
  selectText(box, 1);
  await waitFor(() =>
    expect(change).toHaveBeenCalledExactlyOnceWith({
      value: initial,
      selection: {
        anchor: { blockId: 'intro', offset: 1 },
        focus: { blockId: 'intro', offset: 1 },
      },
    }),
  );
  await waitFor(() => expect(window.getSelection()?.anchorOffset).toBe(5));
});

it('isolates formatting and document callbacks between editor scopes', async () => {
  const first = vi.fn();
  const second = vi.fn();
  render(
    <>
      <SharedEditor
        label="First"
        value={initial}
        onValueChange={first}
        toolbar={
          <SharedEditorToolbar label="First formatting" items={[{ command: 'bold' }]} />
        }
      />
      <SharedEditor
        label="Second"
        value={initial}
        onValueChange={second}
        toolbar={
          <SharedEditorToolbar
            label="Second formatting"
            items={[{ command: 'italic' }]}
          />
        }
      />
    </>,
  );
  const firstBox = await screen.findByRole('textbox', { name: 'First' });
  await screen.findByRole('textbox', { name: 'Second' });
  selectText(firstBox, 0, 5);
  await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).not.toHaveBeenCalled();
});

it('rejects a split atomically without a partial selection', async () => {
  const change = vi.fn();
  render(
    <SharedEditor
      label="Notes"
      value={initial}
      onEditChange={change}
      selection={{
        anchor: { blockId: 'intro', offset: 5 },
        focus: { blockId: 'intro', offset: 5 },
      }}
    />,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  box.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(change).toHaveBeenCalledTimes(1));
  const request: unknown = change.mock.lastCall?.[0];
  expect(editorEditSchema.safeParse(request).success).toBe(true);
  await waitFor(() => expect(box.querySelectorAll('p')).toHaveLength(1));
  expect(box.textContent).toBe('Start');
});
