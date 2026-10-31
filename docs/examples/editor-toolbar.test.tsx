import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { selectEditorText } from '../../test-support/editor-selection.js';
import { EditorToolbarExample } from './editor-toolbar.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

it('runs scoped literal toolbar commands and host-controlled protection', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <EditorToolbarExample />
    </ReacdProvider>,
  );
  const editor = await screen.findByRole('textbox', { name: 'Review draft' });
  act(() => selectEditorText(editor, 'all'));
  const toolbar = screen.getByRole('toolbar', { name: 'Review formatting' });
  await user.click(within(toolbar).getByRole('button', { name: 'Bold' }));
  await waitFor(() =>
    expect(editor.querySelector('strong')?.textContent).toBe('Toolbar draft.'),
  );
  await user.click(screen.getByRole('switch', { name: 'Disable review toolbar' }));
  expect(within(toolbar).getByRole('button', { name: 'Bold' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Read-only review draft' }));
  expect(editor).toHaveAttribute('aria-readonly', 'true');
  await user.click(screen.getByRole('button', { name: 'Restore toolbar draft' }));
  await waitFor(() => expect(editor.querySelector('strong')).toBeNull());
});
