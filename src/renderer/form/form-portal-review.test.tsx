import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Form, ReacdProvider, Select } from '../../index.js';

it.each(['disabled', 'submitting'] as const)(
  'protects an open portal and preserves %s form semantics',
  async (flag) => {
    const user = userEvent.setup();
    const change = vi.fn();
    function view(blocked: boolean, value = 'reader') {
      return (
        <ReacdProvider adapter={shadcnAdapter}>
          <Form
            label="Settings"
            onSubmit={vi.fn()}
            disabled={flag === 'disabled' && blocked}
            submitting={flag === 'submitting' && blocked}
          >
            <Select
              label="Role"
              name="role"
              value={value}
              onValueChange={change}
              items={[
                { value: 'reader', label: 'Reader' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </Form>
        </ReacdProvider>
      );
    }
    const mounted = render(view(false));
    await user.click(screen.getByRole('combobox', { name: 'Role' }));
    const option = await screen.findByRole('option', { name: 'Admin' });
    mounted.rerender(view(true));
    await waitFor(() => expect(option).not.toBeVisible());
    fireEvent.click(option);
    await user.keyboard('{Enter}');
    expect(change).not.toHaveBeenCalled();
    const form = screen.getByRole('form', { name: 'Settings' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected form.');
    expect([...new FormData(form)]).toEqual(
      flag === 'disabled' ? [] : [['role', 'reader']],
    );
    mounted.rerender(view(true, 'admin'));
    expect([...new FormData(form)]).toEqual(
      flag === 'disabled' ? [] : [['role', 'admin']],
    );
    expect(change).not.toHaveBeenCalled();
    mounted.rerender(view(false, 'admin'));
    await user.click(screen.getByRole('combobox', { name: 'Role' }));
    await user.click(await screen.findByRole('option', { name: 'Reader' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('reader');
  },
);
