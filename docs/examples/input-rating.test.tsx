import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputRatingExample } from './input-rating.js';

it('runs the documented rating, clear action and read-only state', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <InputRatingExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left rating' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left rating' }));
  screen.getByRole('slider', { name: 'Service rating' }).focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByText('Rating: 3 of 5')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Save rating' }));
  expect(screen.getByText('Rating saved.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Clear Service rating' }));
  expect(screen.getByText('Rating: 0 of 5')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Read-only rating' }));
  expect(screen.getByRole('slider', { name: 'Service rating' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
});
