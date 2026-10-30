import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { EditorControlledExample } from './editor-controlled.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

it('accepts atomic split/removal and rejects a later structural proposal', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <EditorControlledExample />
    </ReacdProvider>,
  );
  const editor = await screen.findByRole('textbox', { name: 'Controlled notes' });
  expect(screen.getByText('Accepted blocks: 1')).toBeVisible();
  expect(screen.getByText('Atomic edit requests: 0')).toBeVisible();
  act(() => editor.focus());
  await user.keyboard('{Enter}');
  await waitFor(() => expect(screen.getByText('Accepted blocks: 2')).toBeVisible());
  expect(editor.querySelectorAll('p')).toHaveLength(2);
  expect(screen.queryByRole('alert')).toBeNull();
  await user.keyboard('{Backspace}');
  await waitFor(() => expect(screen.getByText('Accepted blocks: 1')).toBeVisible());
  expect(editor.querySelectorAll('p')).toHaveLength(1);
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('switch', { name: 'Reject atomic edits' }));
  act(() => editor.focus());
  const previousRequests = screen.getByText(/^Atomic edit requests:/).textContent;
  await user.keyboard('{Enter}');
  await waitFor(() =>
    expect(screen.getByText(/^Atomic edit requests:/).textContent).not.toBe(
      previousRequests,
    ),
  );
  await waitFor(() => expect(editor.querySelectorAll('p')).toHaveLength(1));
  expect(screen.getByText('Accepted blocks: 1')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Restore atomic draft' }));
  expect(screen.getByText('Atomic edit requests: 0')).toBeVisible();
  expect(editor.textContent).toBe('Controlled draft.');
});
