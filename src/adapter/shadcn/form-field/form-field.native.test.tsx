import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFormField } from './form-field.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnTextarea } from '../textarea/textarea.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';

it('composes SDK field messages and forwards canonical metadata to controls', () => {
  const view = render(
    <ShadcnFormField
      name="account"
      label="Account"
      required
      description="Account details"
      hint="Hint"
      help="Help"
      error="Invalid account"
    >
      <ShadcnInput label="Email" value="" onValueChange={vi.fn()} />
    </ShadcnFormField>,
  );
  expect(screen.getByRole('group', { name: 'Account' })).toHaveAttribute(
    'data-slot',
    'field',
  );
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(input).toHaveAttribute('name', 'account');
  expect(input).toHaveAttribute('required');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription(
    'Account details Hint Help Invalid account',
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid account');
  view.rerender(
    <ShadcnFormField name="account">
      <ShadcnInput label="Email" value="" onValueChange={vi.fn()} />
    </ShadcnFormField>,
  );
  expect(input).not.toHaveAttribute('aria-describedby');
  expect(input).not.toHaveAttribute('required');
});

it('inherits disabled form state while allowing explicit native control names', () => {
  render(
    <ShadcnForm label="Profile" onSubmit={vi.fn()} disabled>
      <ShadcnFormField name="profile" label="Profile data">
        <ShadcnInput label="Name" name="name" value="Ada" onValueChange={vi.fn()} />
      </ShadcnFormField>
    </ShadcnForm>,
  );
  expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('name', 'name');
});

it('blocks controlled errors and focuses the registered native SDK input', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  function View({ error }: { error: string }) {
    return (
      <ShadcnForm label="Account" onSubmit={submit}>
        <ShadcnFormField name="notes" error={error}>
          <ShadcnInput label="Notes" value="Reviewed" onValueChange={vi.fn()} />
        </ShadcnFormField>
        <button type="submit">Save account</button>
      </ShadcnForm>
    );
  }
  const view = render(<View error="" />);
  view.rerender(<View error="Rejected" />);
  await user.click(screen.getByRole('button', { name: 'Save account' }));
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus(),
  );
  expect(submit).not.toHaveBeenCalled();
  view.rerender(<View error="" />);
  await user.click(screen.getByRole('button', { name: 'Save account' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('focuses textarea errors and preserves native field serialization', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Notes form" onSubmit={submit}>
      <ShadcnFormField name="notes" error="Review notes">
        <ShadcnTextarea label="Notes" value="Draft" onValueChange={vi.fn()} />
      </ShadcnFormField>
      <ShadcnInput label="Unnamed" value="Private" onValueChange={vi.fn()} />
      <button type="submit">Save notes</button>
    </ShadcnForm>,
  );
  const notes = screen.getByRole('textbox', { name: 'Notes' });
  await user.click(notes);
  await user.keyboard('x');
  await user.tab();
  await user.keyboard('y');
  await user.click(screen.getByRole('button', { name: 'Save notes' }));
  await waitFor(() => expect(notes).toHaveFocus());
  expect(submit).not.toHaveBeenCalled();
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected the native SDK form');
  expect([...new FormData(form)]).toEqual([['notes', 'Draft']]);
});
