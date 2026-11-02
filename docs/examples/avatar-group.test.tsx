import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { AvatarGroupExample } from './avatar-group.js';

it('shows two identities and reveals both remaining people with the SDK', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}><AvatarGroupExample /></ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Example Reader' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'Example Editor' })).toBeVisible();
  expect(screen.queryByRole('slider')).toBeNull();
  expect(screen.queryByRole('switch')).toBeNull();
  expect(screen.queryByRole('combobox')).toBeNull();
  const trigger = screen.getByRole('button', { name: 'Show 2 more people' });
  trigger.focus();
  await user.keyboard('{Enter}');
  expect(screen.getByText('Example reviewer Alexandra Montgomery')).toBeVisible();
  expect(screen.getByText('👩‍💻 Example Observer')).toBeVisible();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(trigger).toHaveFocus();
});
