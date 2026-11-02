import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { MuiAvatarGroup } from './avatar-group.adapter.js';
it('uses native Material AvatarGroup and Popover for overflow disclosure', async () => {
  const view = render(
    <MuiAvatarGroup
      label="Team"
      max={1}
      items={[
        { id: 'ada', name: 'Ada Chen' },
        { id: 'mina', name: 'Mina Patel' },
      ]}
    />,
  );
  expect(view.container.querySelector('.MuiAvatarGroup-root')).not.toBeNull();
  expect(screen.getByRole('img', { name: 'Ada Chen' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Show 1 more people' }));
  expect(await screen.findByText('Mina Patel')).toBeVisible();
  await userEvent.keyboard('{Escape}');
});
it('uses Material feedback for an empty identity collection', () => {
  render(<MuiAvatarGroup label="Team" items={[]} />);
  expect(screen.getByText('No people to display.')).toBeVisible();
});
