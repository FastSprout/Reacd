import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputTagsExample } from './input-tags.js';

it('adds and removes a topic through the native SDK chips', async () => {
  render(
    <ReacdProvider>
      <InputTagsExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.type(input, 'Vue{Enter}');
  expect(input).toHaveValue('');
  await userEvent.click(screen.getByRole('button', { name: 'Remove React' }));
  expect(screen.queryByRole('button', { name: 'Remove React' })).toBeNull();
  expect(screen.getByRole('button', { name: 'Remove Vue' })).toBeVisible();
});
