import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ColorModeImageExample } from './color-mode-image.js';

it('runs the focused image appearance example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeImageExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Resolved appearance: light')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Dark illustration' }));
  expect(screen.getByText('Resolved appearance: dark')).toBeVisible();
});
