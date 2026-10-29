import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { NavigationExample } from './navigation.js';

it('runs the Navigation public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <NavigationExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Reports view' }));
  expect(screen.getByRole('button', { name: 'Reports view' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(screen.getByText('Selected view: reports')).toBeVisible();
});
