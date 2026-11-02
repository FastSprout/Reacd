import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputRatingExample } from './input-rating.js';

it('updates and clears the host-owned rating through native SDK controls', async () => {
  render(
    <ReacdProvider>
      <InputRatingExample />
    </ReacdProvider>,
  );
  screen.getByRole('slider', { name: 'Service rating' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByText('Selected rating: 3')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Clear Service rating' }));
  expect(screen.getByText('Selected rating: 0')).toBeVisible();
});
