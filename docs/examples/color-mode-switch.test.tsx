import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ColorModeSwitchExample } from './color-mode-switch.js';

it('runs the focused switch appearance example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeSwitchExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Resolved appearance: light')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Dark appearance' }));
  expect(screen.getByText('Resolved appearance: dark')).toBeVisible();
});
