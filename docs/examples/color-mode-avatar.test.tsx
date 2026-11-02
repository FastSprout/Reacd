import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ColorModeAvatarExample } from './color-mode-avatar.js';

it('switches the focused avatar between light and dark assets', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeAvatarExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Reacd illustration avatar' })).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Dark avatar' }));
  expect(screen.getByRole('switch', { name: 'Dark avatar' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});
