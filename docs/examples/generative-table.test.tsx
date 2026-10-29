import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { GenerativeTableExample } from './generative-table.js';

describe('documented generative DataTable state', () => {
  it('preserves selection and resets pages on filters or sorting', async () => {
    const user = userEvent.setup();
    render(<GenerativeTableExample />);
    await user.click(screen.getByRole('checkbox', { name: 'Select row alpha' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(
      screen.getByRole('checkbox', { name: 'Select row beta' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(
      within(screen.getByRole('table')).getByText('Sample beta'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('checkbox', { name: 'Select row alpha' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.type(screen.getByLabelText('Filter Name'), 'alpha');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Select row alpha' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(within(screen.getByRole('table')).queryByText('Sample beta')).toBeNull();
  });
});
