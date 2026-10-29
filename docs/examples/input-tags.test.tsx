import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { InputTagsExample } from './input-tags.js';

it('runs documented tag entry, form, read-only and scoped RTL controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <InputTagsExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await user.type(input, 'Vue{Enter}');
  expect(screen.getByText('Topics: React, Vue')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Save topics' }));
  expect(screen.getByText('Topics saved.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Right to left tags' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left tags' }));
  await user.click(screen.getByRole('button', { name: 'Clear topics' }));
  expect(screen.queryByRole('button', { name: 'Remove React' })).toBeNull();
  await user.click(screen.getByRole('switch', { name: 'Read-only topics' }));
  expect(input).toHaveAttribute('readonly');
});
