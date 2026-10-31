import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CommandPaletteExample } from './command-palette.js';

describe('documented command palette', () => {
  it('filters commands, applies a host veto and changes result modes', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <CommandPaletteExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('switch', { name: 'Veto command activation' }));
    const profile = screen.getByRole('option', { name: /Open profile locally/ });
    await user.click(profile);
    expect(screen.getByText('No command selected.')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Veto command activation' }));
    await user.click(profile);
    expect(screen.getByText('Profile opened locally.')).toBeInTheDocument();
    await user.type(
      screen.getByRole('combobox', { name: 'Sample command search' }),
      'docs',
    );
    await user.clear(screen.getByRole('combobox', { name: 'Sample command search' }));
    await user.click(
      screen.getByRole('option', { name: 'Inspect documentation locally' }),
    );
    expect(screen.getByText('Documentation inspected locally.')).toBeInTheDocument();
    await user.click(
      screen.getByRole('switch', { name: 'Host-filtered command results' }),
    );
    for (const state of ['Loading', 'Error', 'Ready']) {
      await chooseOption(user, 'Command result status', state);
    }
  });
});
