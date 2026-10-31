import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TextAreaExample } from './text-area.js';

it('runs the TextArea public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <TextAreaExample />
    </ReacdProvider>,
  );
  const notes = screen.getByRole('textbox', { name: 'Additional notes' });
  await user.clear(notes);
  await user.type(notes, 'Reviewed');
  expect(notes).toHaveValue('Reviewed');
  expect(screen.getByText('Current notes: Reviewed')).toBeVisible();
});
