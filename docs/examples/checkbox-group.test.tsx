import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CheckboxGroupExample } from './checkbox-group.js';

describe('documented CheckboxGroup', () => {
  it('changes orientation, disables, selects, saves, and clears', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <CheckboxGroupExample />
      </ReacdProvider>,
    );
    await user.click(
      screen.getByRole('switch', { name: 'Arrange channels horizontally' }),
    );
    await user.click(screen.getByRole('switch', { name: 'Disable channel choices' }));
    await user.click(screen.getByRole('switch', { name: 'Disable channel choices' }));
    await user.click(screen.getByRole('checkbox', { name: 'Email notifications' }));
    await user.click(screen.getByRole('checkbox', { name: 'SMS notifications' }));
    expect(
      screen.getByRole('checkbox', { name: 'In-app notifications' }),
    ).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('button', { name: 'Save channels' }));
    expect(screen.getByText('Saved channels: email, sms')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Clear channels' }));
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toHaveAttribute('aria-checked', 'false');
  });
});
