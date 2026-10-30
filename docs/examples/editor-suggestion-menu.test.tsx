import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { EditorSuggestionMenuExample } from './editor-suggestion-menu.js';

it('runs the editor-suggestion-menu example with input and protection', async () => {
  const restore = installEditorGeometry();
  try {
    render(
      <ReacdProvider>
        <EditorSuggestionMenuExample />
      </ReacdProvider>,
    );
    const box = await screen.findByRole('textbox', {
      name: 'Block suggestion document',
    });
    box.focus();
    await userEvent.keyboard('/he');
    await userEvent.click(await screen.findByRole('option', { name: 'Heading' }));
    expect(box).toHaveFocus();
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset editor-suggestion-menu' }),
    );
    await waitFor(() => expect(box.textContent).toBe(''));
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-suggestion-menu',
      }),
    );
    expect(box).toHaveAttribute('contenteditable', 'false');
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Read-only editor-suggestion-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-suggestion-menu',
      }),
    );
    await userEvent.click(
      screen.getByRole('switch', {
        name: 'Right to left editor-suggestion-menu',
      }),
    );
  } finally {
    restore();
  }
});
