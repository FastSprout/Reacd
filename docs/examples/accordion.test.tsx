import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { AccordionExample } from './accordion.js';

it('keeps independent panels and notes across disclosure changes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <AccordionExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Example notes' }));
  await user.type(screen.getByRole('textbox', { name: 'Panel note' }), 'Release ready');
  await user.click(screen.getByRole('button', { name: 'Example overview' }));
  expect(screen.getByText(/Review the release checklist/)).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Example notes' }));
  await user.click(screen.getByRole('button', { name: 'Example notes' }));
  expect(screen.getByRole('textbox', { name: 'Panel note' })).toHaveValue(
    'Release ready',
  );
  expect(screen.getByRole('button', { name: 'Disabled section' })).toBeDisabled();
});
