import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { expect } from 'vitest';

export async function chooseOption(
  user: UserEvent,
  label: string,
  option: string,
): Promise<void> {
  const trigger = screen.getByRole('combobox', { name: label });
  await user.click(trigger);
  await screen.findByRole('listbox', { name: label });
  await user.click(await screen.findByRole('option', { name: option }));
  await waitFor(() => {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  expect(trigger).toHaveTextContent(option);
}
