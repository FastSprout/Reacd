import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { NavigationExamples } from './navigation-examples.js';

it('preserves selected pages across a scoped direction change', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <NavigationExamples />
    </ReacdProvider>,
  );
  const pager = within(screen.getByRole('navigation', { name: 'Sample result pages' }));
  await user.click(pager.getByRole('button', { name: 'Next page' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left navigation' }));
  expect(view.container.querySelector('.reacd-app')).toHaveAttribute('dir', 'rtl');
  expect(pager.getByRole('status')).toHaveTextContent('Page 2 of 3');
  await user.click(screen.getByRole('switch', { name: 'Right to left navigation' }));
  expect(view.container.querySelector('.reacd-app')).toHaveAttribute('dir', 'ltr');
  expect(pager.getByRole('status')).toHaveTextContent('Page 2 of 3');
});
