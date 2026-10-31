import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { success } from '../../../test-support/data-table.js';
import { installEditorGeometry } from '../../../test-support/editor-geometry.js';
import type { EditorDocument } from '../../core/editor-document.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { GenerativeUI } from './generative-ui.js';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'second', content: [{ type: 'text', text: 'Second' }] },
  ],
};
const MOVED: EditorDocument = {
  version: 1,
  blocks: [...INITIAL.blocks].reverse(),
};
const DEFINITIONS = [
  { key: 'draft', kind: 'richDocument', access: 'readWrite', initial: INITIAL },
];
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
});
afterEach(() => {
  restore();
  vi.restoreAllMocks();
});
function editor(label: string, mode: 'read' | 'readWrite') {
  return {
    type: 'Editor',
    label,
    value: { state: 'draft', mode },
    toolbar: [
      { type: 'EditorDragHandle', label: `${label} blocks`, blockId: 'second' },
    ],
  };
}
it('binds toolbar moves and protects readers during host updates', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry(DEFINITIONS));
  const isolated = success(createStateRegistry(DEFINITIONS));
  const notify = vi.fn();
  const stop = success(registry.subscribe('draft', notify));
  const view = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      registry={registry}
      document={{
        schemaVersion: '0.2',
        state: DEFINITIONS,
        root: {
          type: 'VStack',
          children: [editor('Writer', 'readWrite'), editor('Reader', 'read')],
        },
      }}
    />,
  );
  try {
    const writer = await screen.findByRole('textbox', { name: 'Writer' });
    const reader = await screen.findByRole('textbox', { name: 'Reader' });
    const writerActions = screen.getByRole('group', { name: 'Writer blocks' });
    const readerActions = screen.getByRole('group', { name: 'Reader blocks' });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(notify).not.toHaveBeenCalled();
    expect(reader).toHaveAttribute('aria-readonly', 'true');
    for (const button of within(readerActions).getAllByRole('button')) {
      expect(button).toBeDisabled();
      await user.click(button);
    }
    expect(notify).not.toHaveBeenCalled();
    await user.click(
      within(writerActions).getByRole('button', { name: 'Writer blocks: Move up' }),
    );
    await waitFor(() => expect(reader.textContent).toBe('SecondFirst'));
    expect(writer.textContent).toBe('SecondFirst');
    expect(success(registry.read('draft')).value).toEqual(MOVED);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      key: 'draft',
      kind: 'richDocument',
      value: MOVED,
    });
    expect(success(isolated.read('draft')).value).toEqual(INITIAL);
    act(() => {
      expect(registry.update('draft', INITIAL).success).toBe(true);
    });
    await waitFor(() => expect(reader.textContent).toBe('FirstSecond'));
    expect(writer.textContent).toBe('FirstSecond');
    expect(notify).toHaveBeenCalledTimes(2);
    expect(
      within(readerActions).getByRole('button', { name: 'Reader blocks: Move up' }),
    ).toBeDisabled();
    expect(screen.queryByRole('alert')).toBeNull();
  } finally {
    view.unmount();
    stop();
  }
});
