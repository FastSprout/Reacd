import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CollapsibleExample } from './collapsible.js';

describe('documented Collapsible example', () => {
  it('shares state, retains edits, nests content, and resets the note', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <CollapsibleExample />
      </ReacdProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Advanced settings' });
    await user.click(trigger);
    expect(screen.getByText('Disclosure is open')).toBeVisible();
    await user.type(screen.getByLabelText('Disclosure note'), 'Retained note');
    await chooseOption(user, 'Disclosure role', 'Editor');
    await user.click(screen.getByRole('button', { name: 'Nested settings' }));
    expect(screen.getByText(/Long nested identifier/)).toBeVisible();
    await user.click(trigger);
    expect(screen.getByLabelText('Disclosure note')).not.toBeVisible();
    expect(screen.getByText('Disclosure is closed')).toBeVisible();
    await user.click(screen.getByRole('switch', { name: 'Show advanced settings' }));
    expect(screen.getByRole('region', { name: 'External disclosure' })).toBeVisible();
    expect(screen.getByLabelText('Disclosure note')).toHaveValue('Retained note');
    expect(screen.getByRole('combobox', { name: 'Disclosure role' })).toHaveTextContent(
      'Editor',
    );
    expect(screen.getByText(/Long nested identifier/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Unavailable settings' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Reset disclosure note' }));
    expect(screen.getByLabelText('Disclosure note')).toHaveValue('');
  });
});
