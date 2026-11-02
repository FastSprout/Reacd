import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ButtonExample } from './button.js';

it('declares a readable action with state next to the button', async () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ButtonExample />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Request export' }));
  expect(screen.getByText('Export requests: 1')).toBeVisible();
  expect(screen.queryByRole('switch')).toBeNull();
});
