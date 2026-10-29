import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ReacdProvider } from 'reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { EditorDragHandleExample } from './editor-drag-handle.js';
let restore: () => void = () => undefined;
let restoreScroll: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  restoreScroll = () => scroll.mockRestore();
});
afterEach(() => {
  restore();
  restoreScroll();
});
it('runs atomic edits with rejection and protected restoration', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <EditorDragHandleExample />
    </ReacdProvider>,
  );
  const box = await screen.findByRole('textbox', { name: 'Block reorder document' });
  const up = screen.getByRole('button', { name: 'Review block: Move up' });
  await waitFor(() => expect(up).not.toBeDisabled());
  up.focus();
  await user.keyboard('{Enter}');
  expect(screen.getByText('Block order: review, prepare, publish')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Reject block moves' }));
  await user.click(screen.getByRole('button', { name: 'Review block: Move down' }));
  expect(screen.getByText('Block order: review, prepare, publish')).toBeVisible();
  await user.click(
    screen.getByRole('switch', { name: 'Right to left block controls' }),
  );
  await user.click(screen.getByRole('switch', { name: 'Read-only block document' }));
  expect(box).toHaveAttribute('aria-readonly', 'true');
  expect(
    screen.getByRole('button', { name: 'Review block: Move down' }),
  ).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable block document' }));
  expect(box).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('button', { name: 'Restore block order' }));
  expect(screen.getByText('Block order: prepare, review, publish')).toBeVisible();
});
