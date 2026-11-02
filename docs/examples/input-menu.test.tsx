import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputMenuExample } from './input-menu.js';

it('accepts a destination suggestion or free text', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenuExample />
    </ReacdProvider>,
  );
  const destination = screen.getByRole('combobox', { name: 'Destination' });
  await user.type(destination, 'Kra');
  await user.click(await screen.findByRole('option', { name: 'Kraków' }));
  expect(destination).toHaveValue('Kraków');
  await user.clear(destination);
  await user.type(destination, 'Vienna');
  expect(destination).toHaveValue('Vienna');
});
