import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ColorPickerExample } from './color-picker.js';
it('runs color, rejection, protection and form examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ColorPickerExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Black preset' }));
  const hex = screen.getByRole('textbox', { name: 'Reference color hexadecimal' });
  expect(hex).toHaveValue('#000000ff');
  await user.click(screen.getByRole('switch', { name: 'Reject color changes' }));
  await user.click(screen.getByRole('button', { name: 'Green preset' }));
  expect(hex).toHaveValue('#000000ff');
  await user.click(screen.getByRole('switch', { name: 'Read-only color' }));
  expect(hex).toHaveAttribute('readonly');
  await user.click(screen.getByRole('switch', { name: 'Disable color' }));
  expect(hex).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Restore sample color' }));
  expect(hex).toHaveValue('#33aa6680');
  await user.click(screen.getByRole('switch', { name: 'Disable color' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only color' }));
  await user.click(screen.getByRole('switch', { name: 'Reject color changes' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left colors' }));
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form');
  expect(
    [...form.elements]
      .filter(
        (element) => element instanceof HTMLInputElement && !element.checkValidity(),
      )
      .map((element) => element.outerHTML),
  ).toEqual([]);
  await user.click(screen.getByRole('button', { name: 'Save color' }));
  expect(screen.getByText('Color saved.')).toBeVisible();
});
