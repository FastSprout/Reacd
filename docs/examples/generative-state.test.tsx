import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { validateGenerativeDocument } from '@fastsprout/reacd/generative';
import { GenerativeStateExample, SHARED_STATE_DOCUMENT } from './generative-state.js';

describe('documented shared generative state', () => {
  it('shares two writers and a reader with host-owned status', async () => {
    const user = userEvent.setup();
    render(<GenerativeStateExample />);
    await user.type(screen.getByLabelText('Customer name'), 'Example');
    expect(screen.getByLabelText('Same customer name')).toHaveValue('Example');
    expect(screen.getByText('Example')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Same customer name'), ' Reader');
    expect(screen.getByLabelText('Customer name')).toHaveValue('Example Reader');
    expect(screen.getByText('Example Reader')).toBeInTheDocument();
    expect(screen.getByText('Waiting for host refresh.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Refresh status' }));
    expect(screen.getByText('Refreshed by host.')).toBeInTheDocument();
  });

  it('rejects duplicate definitions and component writes to the host-owned key', () => {
    expect(
      validateGenerativeDocument({
        ...SHARED_STATE_DOCUMENT,
        state: [...SHARED_STATE_DOCUMENT.state, ...SHARED_STATE_DOCUMENT.state],
      }).success,
    ).toBe(false);
    expect(
      validateGenerativeDocument({
        ...SHARED_STATE_DOCUMENT,
        root: {
          type: 'Input',
          label: 'Forbidden editor',
          value: { state: 'service.status', mode: 'readWrite' },
        },
      }).success,
    ).toBe(false);
  });
});
