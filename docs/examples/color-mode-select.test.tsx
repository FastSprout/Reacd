import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ColorModeSelectExample } from './color-mode-select.js';

it('runs the focused select appearance example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorModeSelectExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Resolved appearance: light')).toBeVisible();
  await user.click(screen.getByRole('combobox', { name: 'Color preference' }));
  await user.click(await screen.findByRole('option', { name: /^Dark$/ }));
  expect(screen.getByText('Resolved appearance: dark')).toBeVisible();
});
