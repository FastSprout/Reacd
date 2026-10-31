import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { selectEditorText } from '../../test-support/editor-selection.js';
import { EditorExample } from './editor.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

it('runs editing, host replacement, protection and shared readers', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <EditorExample />
    </ReacdProvider>,
  );
  const writer = await screen.findByRole('textbox', { name: 'Project notes' });
  const reader = await screen.findByRole('textbox', { name: 'Notes reader' });
  expect(screen.getByText('Document edit requests: 0')).toBeVisible();
  expect(reader).toHaveAttribute('aria-readonly', 'true');
  act(() => selectEditorText(writer));
  await user.keyboard('!');
  await waitFor(() => expect(reader.textContent).toBe('Start a project note.!'));
  expect(screen.getByText('Document edit requests: 1')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Replace notes from host' }));
  await waitFor(() => expect(writer.textContent).toBe('Replaced by the host.'));
  expect(reader.textContent).toBe('Replaced by the host.');
  expect(screen.getByText('Document edit requests: 1')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Reject note changes' }));
  act(() => selectEditorText(writer));
  await user.keyboard('!');
  await waitFor(() => expect(writer.textContent).toBe('Replaced by the host.'));
  expect(screen.getByText('Document edit requests: 2')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Read-only notes' }));
  expect(writer).toHaveAttribute('contenteditable', 'false');
  await user.click(screen.getByRole('switch', { name: 'Disable notes' }));
  expect(writer).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('switch', { name: 'Right to left notes' }));
  await user.click(screen.getByRole('button', { name: 'Restore notes document' }));
  await waitFor(() => expect(reader.textContent).toBe('Start a project note.'));
  expect(screen.getByText('Document edit requests: 0')).toBeVisible();
});
