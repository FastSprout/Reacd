import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ColorModeButtonExample } from './color-mode-button.js';

it('runs the focused button appearance example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeButtonExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Resolved appearance: light')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Toggle appearance' }));
  expect(screen.getByText('Resolved appearance: dark')).toBeVisible();
});
