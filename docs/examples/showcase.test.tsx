import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShowcaseExample } from './showcase.js';

it('runs the home gallery forms and independent SDK controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShowcaseExample />
    </ReacdProvider>,
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Your email' }),
    'sam@example.com',
  );
  await user.type(
    screen.getByRole('searchbox', { name: 'Search components' }),
    'Button',
  );
  expect(screen.getByDisplayValue('Button')).toBeVisible();
  await user.click(screen.getByRole('checkbox', { name: 'Review the proposal' }));
  await user.click(screen.getByRole('checkbox', { name: 'Collect feedback' }));
  await user.click(screen.getByRole('checkbox', { name: 'Prepare the release' }));
  screen.getByRole('slider', { name: 'Playback volume' }).focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByText('Volume: 41%')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Can I use my own design?' }));
  expect(
    screen.getByText('Choose an adapter and provide your design tokens.'),
  ).toBeVisible();
  await user.type(screen.getByRole('textbox', { name: 'Transfer amount' }), '120');
  await user.click(screen.getByRole('button', { name: 'Prepare transfer' }));
  expect(await screen.findByText('Sample transfer prepared: 120 USD.')).toBeVisible();
  await user.type(screen.getByRole('textbox', { name: 'Issue title' }), 'Check focus');
  await user.type(
    screen.getByRole('textbox', { name: 'Issue details' }),
    'Keyboard focus should remain visible.',
  );
  await user.click(screen.getByRole('button', { name: 'Prepare report' }));
  expect(await screen.findByText('Draft prepared: Check focus.')).toBeVisible();
  await user.click(screen.getByRole('radio', { name: 'Team' }));
  expect(screen.getByText('Selected plan: team')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Connect account' }));
  expect(screen.getByText('Sample account connected.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Disconnect account' }));
  expect(screen.getByRole('button', { name: 'Connect account' })).toBeVisible();
  await user.click(screen.getByRole('tab', { name: 'Security' }));
  expect(
    screen.getByText('No account or password is sent from this preview.'),
  ).toBeVisible();
  await user.click(screen.getByRole('tab', { name: 'Profile' }));
  await user.type(screen.getByRole('textbox', { name: 'Display name' }), 'Sam');
  expect(screen.getByDisplayValue('Sam')).toBeVisible();
});

it('runs invitation, preferences and bounded progress with local state', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShowcaseExample />
    </ReacdProvider>,
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Work email' }),
    'alex@example.com',
  );
  await user.click(screen.getByRole('button', { name: 'Prepare invitation' }));
  expect(screen.getByText('Invitation prepared for alex@example.com.')).toBeVisible();
  await user.click(screen.getByRole('checkbox', { name: 'Weekly summary' }));
  await user.click(screen.getByRole('switch', { name: 'Activity alerts' }));
  expect(screen.getByRole('switch', { name: 'Activity alerts' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  const complete = screen.getByRole('button', { name: 'Complete a task' });
  for (let index = 0; index < 7; index += 1) await user.click(complete);
  expect(complete).toBeDisabled();
  expect(screen.getByText('100% complete')).toBeVisible();
});
