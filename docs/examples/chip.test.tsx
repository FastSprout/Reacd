import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChipExample } from './chip.js';

describe('documented Chip example', () => {
  it('changes presentation and preserves actions and indicator meaning', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ChipExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open sample messages' }));
    expect(screen.getByText('Sample action count: 1')).toBeInTheDocument();
    for (const [control, values] of [
      ['Chip corner', ['Top start', 'Bottom start', 'Bottom end', 'Top end']],
      ['Chip size', ['Small', 'Large', 'Medium']],
      ['Chip intent', ['Secondary', 'Danger', 'Primary']],
    ] as const) {
      for (const value of values) {
        await chooseOption(user, control, value);
      }
    }
    await user.clear(screen.getByLabelText('Chip text'));
    expect(screen.getByRole('img', { name: 'Unread placeholder' })).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Show chip' }));
    expect(screen.queryByRole('img', { name: 'Unread placeholder' })).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Show chip' }));
    await user.click(screen.getByRole('switch', { name: 'Inset chip' }));
    await user.click(screen.getByRole('switch', { name: 'Standalone chip' }));
    expect(screen.queryByRole('button', { name: 'Open sample messages' })).toBeNull();
  });
});
