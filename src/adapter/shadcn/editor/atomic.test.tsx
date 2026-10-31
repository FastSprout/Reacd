import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Editor, ReacdProvider } from '@fastsprout/reacd';
import type { EditorEdit } from '../../../core/editor-edit.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { editorEditSchema } from '../../../schema/editor/edit.schema.js';

const initial: EditorEdit = {
  value: {
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
      { type: 'paragraph', id: 'last', content: [{ type: 'text', text: 'Last' }] },
    ],
  },
  selection: {
    anchor: { blockId: 'last', offset: 2 },
    focus: { blockId: 'last', offset: 2 },
  },
};

it('accepts selected-block removal as one valid controlled snapshot', async () => {
  const restore = installEditorGeometry();
  const changed = vi.fn();
  function Host() {
    const [edit, setEdit] = useState(initial);
    return (
      <Editor
        label="Atomic document"
        {...edit}
        onEditChange={(next) => {
          changed(next);
          setEdit(next);
        }}
      />
    );
  }
  try {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Host />
      </ReacdProvider>,
    );
    const box = await screen.findByRole('textbox', { name: 'Atomic document' });
    expect(changed).not.toHaveBeenCalled();
    box.focus();
    await userEvent.keyboard('{Control>}a{/Control}');
    changed.mockClear();
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(box.textContent).toBe(''));
    const request: unknown = changed.mock.lastCall?.[0];
    expect(Object.isFrozen(request)).toBe(true);
    const parsed = editorEditSchema.safeParse(request);
    expect(parsed.success).toBe(true);
    expect(changed).toHaveBeenCalledTimes(1);
    if (parsed.success) {
      expect(parsed.data.value.blocks.some((block) => block.id === 'last')).toBe(false);
      expect(Object.isFrozen(parsed.data.selection)).toBe(true);
    }
    expect(screen.queryByRole('alert')).toBeNull();
  } finally {
    restore();
  }
});
