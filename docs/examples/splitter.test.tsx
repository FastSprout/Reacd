import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SplitterExample } from './splitter.js';
import { installLayout } from '../../test-support/layout-observer.js';

it('runs Splitter Jotai state and resets controlled percentage shares', async () => {
  const restore = installLayout();
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider>
      <SplitterExample />
    </ReacdProvider>,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Splitter outline query' }), {
    target: { value: 'Changed outline' },
  });
  fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
  expect(screen.getByText('outline share: 51')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Splitter RTL' }));
  await user.click(screen.getByRole('switch', { name: 'Vertical splitter' }));
  await user.click(screen.getByRole('switch', { name: 'Disable resizing' }));
  await user.click(screen.getByRole('switch', { name: 'Disable resizing' }));
  await user.click(screen.getByRole('button', { name: 'Reset panel shares' }));
  expect(screen.getByText('outline share: 50')).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Splitter outline query' })).toHaveValue(
    'Changed outline',
  );
  view.unmount();
  restore();
});
