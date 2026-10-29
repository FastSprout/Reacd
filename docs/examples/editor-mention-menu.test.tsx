import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { EditorMentionMenuExample } from './editor-mention-menu.js';

it('runs the editor-mention-menu example with input and protection', async () => {
  const restore = installEditorGeometry();
  try {
    render(
      <ReacdProvider>
        <EditorMentionMenuExample />
      </ReacdProvider>,
    );
    const box = await screen.findByRole('textbox', { name: 'Mention document' });
    box.focus();
    await userEvent.keyboard('@ex');
    await userEvent.click(
      await screen.findByRole('option', { name: 'Example person' }),
    );
    expect(box).toHaveFocus();
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset editor-mention-menu' }),
    );
    await waitFor(() => expect(box.textContent).toBe(''));
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-mention-menu',
      }),
    );
    expect(box).toHaveAttribute('contenteditable', 'false');
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-mention-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-mention-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-mention-menu',
      }),
    );
  } finally {
    restore();
  }
});
