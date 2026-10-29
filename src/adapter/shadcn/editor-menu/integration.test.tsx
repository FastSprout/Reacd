import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { ShadcnEditor } from '../editor/editor.adapter.js';
import {
  ShadcnEditorSuggestionMenu,
} from '../editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import {
  ShadcnEditorMentionMenu,
} from '../editor-mention-menu/editor-mention-menu.adapter.js';
import {
  ShadcnEditorEmojiMenu,
} from '../editor-emoji-menu/editor-emoji-menu.adapter.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());
function Example() {
  const [value, setValue] = useState(() =>
    editorDocumentSchema.parse({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
    }),
  );
  return (
    <ShadcnEditor label="Notes" value={value} onValueChange={setValue}>
      <ShadcnEditorSuggestionMenu
        label="Insert block"
        items={[
          { command: 'paragraph', label: 'Paragraph' },
          { command: 'heading1', label: 'Heading' },
        ]}
      />
      <ShadcnEditorMentionMenu
        label="People"
        items={[
          { id: 'blocked', label: 'Unavailable', disabled: true },
          { id: 'person', label: 'Example person' },
        ]}
      />
      <ShadcnEditorEmojiMenu
        label="Emoji"
        items={[{ name: 'wave', value: '👋', label: 'Wave' }]}
      />
    </ShadcnEditor>
  );
}

it('filters slash commands and applies the selected block', async () => {
  render(<Example />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  box.focus();
  await userEvent.keyboard('/he');
  expect(await screen.findByRole('listbox', { name: 'Insert block' })).toBeVisible();
  expect(screen.queryByRole('option', { name: 'Paragraph' })).toBeNull();
  expect(screen.getByRole('option', { name: 'Heading' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(box.querySelector('h1')).not.toBeNull());
  expect(box.textContent).toBe('');
  expect(box).toHaveFocus();
});

it('skips disabled mentions during keyboard insertion', async () => {
  render(<Example />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  box.focus();
  await userEvent.keyboard('@');
  expect(await screen.findByRole('listbox', { name: 'People' })).toBeVisible();
  expect(screen.getByRole('option', { name: 'Unavailable' })).toBeDisabled();
  expect(screen.getByRole('option', { name: 'Example person' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await userEvent.keyboard('{ArrowDown}{ArrowUp}{Enter}');
  await waitFor(() => expect(box.textContent).toBe('@Example person '));
  expect(box).toHaveFocus();
});

it('dismisses empty results and supports emoji pointer selection', async () => {
  render(<Example />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  box.focus();
  await userEvent.keyboard(':missing');
  expect(await screen.findByText('No matching results.')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('listbox', { name: 'Emoji' })).toBeNull();
  await userEvent.keyboard(' :wa');
  await userEvent.click(await screen.findByRole('option', { name: 'Wave' }));
  await waitFor(() =>
    expect(box.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'wave'),
  );
  expect(box).toHaveFocus();
});
