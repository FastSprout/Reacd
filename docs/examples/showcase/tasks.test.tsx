import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CalendarCard } from './calendar.js';
import { VerificationCard } from './verification.js';
import { AnnouncementCard } from './announcement.js';
import { ContributorsCard } from './contributors.js';
import { LoginCard } from './login.js';
import { ChatCard } from './chat.js';

it('keeps calendar, verification and chat tasks working in gallery cards', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <CalendarCard />
      <VerificationCard />
      <ChatCard />
      <ContributorsCard />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: /November 18, 2026$/ }));
  expect(screen.getByText('Delivery day: 2026-11-18')).toBeVisible();
  const code = screen.getByRole('textbox', { name: 'Verification code' });
  await user.type(code, '001234');
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  expect(await screen.findByText('Code submitted.')).toBeVisible();
  await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Meet tomorrow');
  await user.keyboard('{Enter}');
  expect(screen.getByText('Last sent: Meet tomorrow')).toBeVisible();
  expect(screen.getByRole('group', { name: 'Project contributors' })).toBeVisible();
});

it(
  'dismisses and restores an announcement and validates local credential entry',
  async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <AnnouncementCard />
        <LoginCard />
      </ReacdProvider>,
    );
    expect(screen.getByRole('link', { name: 'Read the banner guide' })).toHaveAttribute(
      'href',
      '/components/banner/',
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss update' }));
    expect(screen.queryByRole('status', { name: 'Workspace update' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Restore update' }));
    expect(screen.getByRole('status', { name: 'Workspace update' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Continue locally' }));
    expect(screen.queryByText('Local sign-in form completed.')).toBeNull();
    await user.type(
      screen.getByRole('textbox', { name: 'Account email' }),
      'avery@example.com',
    );
    await user.type(screen.getByLabelText('Account password'), 'example-password');
    await user.click(screen.getByRole('button', { name: 'Continue locally' }));
    await waitFor(() =>
      expect(screen.getByText('Local sign-in form completed.')).toBeVisible(),
    );
  },
);
