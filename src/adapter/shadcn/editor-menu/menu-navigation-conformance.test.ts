import { userEvent } from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { createMenuEditor } from '../../../../test-support/editor-menu-fixture.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { success } from '../../../../test-support/data-table.js';
import type { EditorMenuView } from '../../../renderer/editor/menu-context.js';
import { createEditorMenuPort } from './menu-port.js';
import { editorDocumentFromSdk } from '../editor-conversion/from-sdk.js';

it('wraps among enabled choices and resets the cursor after filtering', async () => {
  const restore = installEditorGeometry();
  const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  const fixture = createMenuEditor();
  let latest: EditorMenuView | undefined;
  const lease = success(
    createEditorMenuPort(fixture.instance, false).mount({
      kind: 'mention',
      listId: 'people',
      items: () => [
        { kind: 'mention', id: 'alice', label: 'Alice' },
        { kind: 'mention', id: 'blocked', label: 'Blocked', disabled: true },
        { kind: 'mention', id: 'bob', label: 'Bob' },
        { kind: 'mention', id: 'cara', label: 'Cara' },
      ],
      change(view) {
        latest = view;
      },
    }),
  );
  try {
    const user = userEvent.setup();
    fixture.input.focus();
    await user.keyboard('@');
    await waitFor(() => expect(latest?.selected).toBe(0));
    for (const [key, selected] of [
      ['ArrowDown', 2],
      ['ArrowDown', 3],
      ['ArrowDown', 0],
      ['ArrowUp', 3],
      ['ArrowUp', 2],
    ] as const) {
      await user.keyboard(`{${key}}`);
      expect(latest?.selected).toBe(selected);
      expect(fixture.input).toHaveAttribute(
        'aria-activedescendant',
        `people-${selected}`,
      );
    }
    await user.keyboard('b');
    await waitFor(() => expect(latest?.query).toBe('b'));
    expect(latest?.items.map((item) => item.label)).toEqual(['Blocked', 'Bob']);
    expect(latest?.selected).toBe(1);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(fixture.instance.getText()).toBe('@Bob '));
    expect(fixture.input).not.toHaveAttribute('aria-controls');
    expect(success(editorDocumentFromSdk(fixture.instance.state.doc)).blocks).toEqual([
      {
        type: 'paragraph',
        id: 'fixture',
        content: [
          { type: 'mention', id: 'bob', label: 'Bob' },
          { type: 'text', text: ' ' },
        ],
      },
    ]);
  } finally {
    lease.destroy();
    fixture.dispose();
    scroll.mockRestore();
    restore();
  }
});
