import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ThemeExample } from './theme.js';
import { userEvent } from '@testing-library/user-event';

it('renders the documented Theme declaration', () => {
  render(
    <ReacdProvider>
      <ThemeExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Scoped compact appearance')).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('preserves local actions under a scoped template', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ThemeExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Run scoped action' }));
  expect(screen.getByText('Scoped actions: 1')).toBeVisible();
  expect(screen.getByText('Scoped compact appearance')).toHaveAttribute(
    'data-role',
    'caption',
  );
});
