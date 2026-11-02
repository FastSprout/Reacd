import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SwitchExample } from './switch.js';

it('saves the publishing setting without protection test switches', async () => {
  render(
    <ReacdProvider>
      <SwitchExample />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('switch')).toHaveLength(1);
  await userEvent.click(screen.getByRole('switch', { name: 'Publish updates' }));
  await userEvent.click(screen.getByRole('button', { name: 'Save publishing' }));
  expect(screen.getByText('Publishing saved.')).toBeVisible();
});
