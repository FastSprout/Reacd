import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { EditorEmojiMenuExample } from './editor-emoji-menu.js';

it('runs the editor-emoji-menu example with input and protection', async () => {
  const restore = installEditorGeometry();
  try {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <EditorEmojiMenuExample />
      </ReacdProvider>,
    );
    const box = await screen.findByRole('textbox', { name: 'Emoji document' });
    box.focus();
    await userEvent.keyboard(':wa');
    await userEvent.click(await screen.findByRole('option', { name: 'Wave' }));
    expect(box).toHaveFocus();
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset editor-emoji-menu' }),
    );
    await waitFor(() => expect(box.textContent).toBe(''));
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-emoji-menu',
      }),
    );
    expect(box).toHaveAttribute('contenteditable', 'false');
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-emoji-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-emoji-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-emoji-menu',
      }),
    );
  } finally {
    restore();
  }
});
