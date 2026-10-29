import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { LocaleSelectExample } from './locale-select.js';

it('applies host language and direction with protected controls', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider>
      <LocaleSelectExample />
    </ReacdProvider>,
  );
  const control = screen.getByRole('combobox', { name: 'Application language' });
  await user.click(control);
  await user.click(await screen.findByRole('option', { name: 'Arabic' }));
  await waitFor(() => expect(control).toHaveAttribute('aria-expanded', 'false'));
  expect(screen.getByText('Selected locale: ar')).toBeVisible();
  expect(view.container.querySelector('.reacd-app')).toHaveAttribute('dir', 'rtl');
  expect(view.container.querySelector('.reacd-app')).toHaveAttribute('lang', 'ar');
  await user.click(screen.getByRole('switch', { name: 'Read-only language' }));
  expect(control).toHaveAttribute('aria-readonly', 'true');
  await user.click(screen.getByRole('switch', { name: 'Disable language' }));
  expect(control).toBeDisabled();
});
