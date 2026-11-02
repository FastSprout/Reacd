import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ContactFormExample } from './recipe-contact-form.js';

it('validates, submits and clears browser-local contact data', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ContactFormExample />
    </ReacdProvider>,
  );
  const field = screen.getByRole('textbox', { name: 'Contact name' });
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(field).toBeInstanceOf(HTMLInputElement);
  if (!(field instanceof HTMLInputElement)) throw new Error('Missing input.');
  expect(field.checkValidity()).toBe(false);
  expect(screen.getByText('No contact saved.')).toBeVisible();
  await user.type(field, 'Ada');
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByText('Saved contact for Ada.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear contact' }));
  expect(field).toHaveValue('');
  expect(screen.getByText('No contact saved.')).toBeVisible();
});
