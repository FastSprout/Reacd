import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnAvatarGroup } from './avatar-group.adapter.js';

it('uses SDK group, overflow disclosure and avatar identities', async () => {
  const view = render(
    <ShadcnAvatarGroup
      label="Team"
      max={1}
      items={[
        { id: 'ada', name: 'Ada' },
        { id: 'lin', name: 'Lin' },
      ]}
    />,
  );
  expect(screen.getByRole('group', { name: 'Team' })).toHaveAttribute(
    'data-slot',
    'avatar-group',
  );
  expect(screen.getByRole('img', { name: 'Ada' })).toBeVisible();
  const trigger = screen.getByRole('button', { name: 'Show 1 more person' });
  await userEvent.click(trigger);
  expect(screen.getByRole('dialog')).toHaveTextContent('Lin');
  expect(screen.getByRole('list', { name: 'Additional people' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  expect(trigger).toHaveFocus();
  view.rerender(<ShadcnAvatarGroup label="Team" items={[]} />);
  expect(screen.getByText('No people to display.')).toBeVisible();
  view.rerender(
    <ShadcnAvatarGroup label="Team" items={[]} emptyMessage="Empty team" />,
  );
  expect(screen.getByText('Empty team')).toBeVisible();
});

it('preserves every overflow identity and closes through the SDK action', async () => {
  render(<ShadcnAvatarGroup label="Reviewers" max={1} size="large" items={[
    { id: 'ada', name: 'Ada' },
    { id: 'lin', name: 'Lin' },
    { id: 'kim', name: 'Kim' },
  ]} />);
  const group = screen.getByRole('group', { name: 'Reviewers' });
  expect(group.querySelectorAll('[role="img"]')).toHaveLength(1);
  const trigger = screen.getByRole('button', { name: 'Show 2 more people' });
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  const list = screen.getByRole('list', { name: 'Additional people' });
  expect(list.querySelectorAll('[role="listitem"]')).toHaveLength(2);
  expect(screen.getByRole('img', { name: 'Lin' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'Kim' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Close people' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(trigger).toHaveFocus();
});
