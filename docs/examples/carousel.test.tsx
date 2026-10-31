import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CarouselExample } from './carousel.js';
it('runs navigation, retained edits and host previews', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <CarouselExample />
    </ReacdProvider>,
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Profile slide draft' }),
    ' edited',
  );
  await user.click(screen.getByRole('button', { name: 'Submit active slide' }));
  expect(screen.getByText('Slide form submissions: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  await user.click(screen.getByRole('button', { name: 'Review slide action' }));
  expect(screen.getByText('Slide reviews: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Previous slide' }));
  expect(screen.getByRole('textbox', { name: 'Profile slide draft' })).toHaveValue(
    'Draft profile edited',
  );
  await user.click(screen.getByRole('switch', { name: 'Loop carousel' }));
  await user.click(screen.getByRole('switch', { name: 'Vertical carousel keys' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left carousel' }));
  await user.click(screen.getByRole('switch', { name: 'Readonly carousel' }));
  expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable carousel navigation' }));
  await user.click(screen.getByRole('switch', { name: 'Empty carousel' }));
  expect(screen.getByRole('status')).toHaveTextContent('No slides available.');
  await user.click(screen.getByRole('switch', { name: 'Empty carousel' }));
  await user.click(screen.getByRole('button', { name: 'Preview loading slides' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading slides.');
  await user.click(screen.getByRole('button', { name: 'Preview slide error' }));
  await user.click(screen.getByRole('button', { name: 'Retry slides' }));
  expect(screen.getByText('Slide retries: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Advance carousel from host' }));
});
