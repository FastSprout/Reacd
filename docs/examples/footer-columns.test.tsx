import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FooterColumnsExample } from './footer-columns.js';
it('keeps footer targets and notes independent', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <FooterColumnsExample />
    </ReacdProvider>,
  );
  const note = screen.getByRole('textbox', { name: 'Footer note' });
  await user.clear(note);
  await user.type(note, 'Retained note');
  await user.click(screen.getByRole('button', { name: 'Select resource locally' }));
  expect(screen.getByText('Resource selected locally.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Disable footer action' }));
  expect(
    screen.getByRole('button', { name: 'Select resource locally' }),
  ).toBeDisabled();
  expect(note).toHaveValue('Retained note');
  expect(screen.queryByRole('alert')).toBeNull();
});
