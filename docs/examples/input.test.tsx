import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputExample } from './input.js';

it('edits and saves contact email without conformance controls', async () => {
  render(
    <ReacdProvider>
      <InputExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('switch')).toBeNull();
  const email = screen.getByRole('textbox', { name: 'Contact email' });
  expect(email).toHaveAttribute('autocomplete', 'email');
  await userEvent.clear(email);
  await userEvent.type(email, 'reader@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByText('Contact saved.')).toBeVisible();
});
