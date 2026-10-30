import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { AuthMediaExamples } from './auth-media-examples.js';

it('keeps local state while changing scoped direction', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <AuthMediaExamples />
    </ReacdProvider>,
  );
  await user.type(screen.getByRole('textbox'), 'retained@example.com');
  await user.click(screen.getByRole('switch', { name: 'Auth media RTL' }));
  expect(screen.getByRole('textbox')).toHaveValue('retained@example.com');
});
