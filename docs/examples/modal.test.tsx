import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ModalExample } from './modal.js';

describe('documented Modal example', () => {
  it('applies edits, supports nested dialogs, and exposes long content', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <ModalExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open programmatically' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Open programmatically' }),
      ).toHaveFocus(),
    );
    await user.click(screen.getByRole('switch', { name: 'Long dialog content' }));
    await user.click(screen.getByRole('button', { name: 'Open modal example' }));
    expect(screen.getByText(/Long dialog content without spaces/)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Modal note'), 'Example note');
    const role = screen.getByRole('combobox', { name: 'Modal role' });
    await user.click(role);
    const options = await screen.findByRole('listbox', { name: 'Modal role' });
    expect(screen.getByRole('dialog').contains(options)).toBe(true);
    await user.click(await screen.findByRole('option', { name: 'Editor' }));
    await waitFor(() => expect(role).toHaveAttribute('aria-expanded', 'false'));
    expect(role).toHaveTextContent('Editor');
    await user.click(screen.getByRole('button', { name: 'Open nested modal' }));
    expect(screen.getByRole('dialog', { name: 'Nested modal' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Nested modal' })).toBeNull(),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open nested modal' })).toHaveFocus(),
    );
    await user.click(screen.getByRole('button', { name: 'Apply example' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(screen.getByRole('button', { name: 'Open modal example' }));
    expect(screen.getByLabelText('Modal note')).toHaveValue('Example note');
  });
});
