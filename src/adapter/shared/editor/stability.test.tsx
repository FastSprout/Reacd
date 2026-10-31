import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { SharedEditor } from './editor.adapter.js';

it('preserves a pending caret collapse across unchanged props', async () => {
  const restore = installEditorGeometry();
  const text = 'Native caret';
  const value = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'paragraph', id: 'intro', content: [{ type: 'text', text }] }],
  });
  const change = vi.fn();
  try {
    const view = render(
      <SharedEditor label="Notes" value={value} onValueChange={change} />,
    );
    const box = await screen.findByRole('textbox', { name: 'Notes' });
    box.focus();
    await userEvent.keyboard('{Control>}a{/Control}');
    const selection = window.getSelection();
    const content = box.querySelector('p')?.firstChild;
    if (selection === null || content === null || content === undefined)
      throw new Error('Expected native selection fixture.');
    expect(selection.isCollapsed).toBe(false);
    const caret = document.createRange();
    caret.setStart(content, text.length);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
    expect(selection.isCollapsed).toBe(true);
    view.rerender(<SharedEditor label="Notes" value={value} onValueChange={change} />);
    expect(selection.isCollapsed).toBe(true);
    const beforeCaret = document.createRange();
    beforeCaret.selectNodeContents(box);
    if (selection.anchorNode === null)
      throw new Error('Expected retained native caret.');
    beforeCaret.setEnd(selection.anchorNode, selection.anchorOffset);
    expect(beforeCaret.toString()).toBe(text);
    expect(change).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});
