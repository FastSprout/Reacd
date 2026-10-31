import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { RadioGroupExample } from './radio-group.js';

describe('documented RadioGroup', () => {
  it('changes orientation, disables, selects, saves, and clears', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <RadioGroupExample />
      </ReacdProvider>,
    );
    await user.click(
      screen.getByRole('switch', { name: 'Arrange delivery horizontally' }),
    );
    await user.click(screen.getByRole('switch', { name: 'Disable delivery choices' }));
    expect(screen.getByRole('radio', { name: 'Express delivery' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await user.click(screen.getByRole('switch', { name: 'Disable delivery choices' }));
    await user.click(screen.getByRole('radio', { name: 'Express delivery' }));
    await user.click(screen.getByRole('button', { name: 'Save delivery' }));
    expect(screen.getByText('Saved delivery: express')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Clear delivery' }));
    expect(screen.getByRole('radio', { name: 'Express delivery' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });
});
