import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TextareaExample } from './textarea.js';

it('edits release notes without a stress or protection panel', async () => {
  render(
    <ReacdProvider>
      <TextareaExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('switch')).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
  const notes = screen.getByRole('textbox', { name: 'Release notes' });
  await userEvent.type(notes, 'Add release details.');
  expect(notes).toHaveValue('Add release details.');
});
