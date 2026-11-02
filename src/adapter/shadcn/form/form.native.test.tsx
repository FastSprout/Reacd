import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('validates required fields and submits zero-argument actions', async () => {
  const submit = vi.fn();
  const view = render(
    <ShadcnForm label="Profile" onSubmit={submit}>
      <ShadcnInput label="Name" value="" required onValueChange={() => undefined} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnForm label="Profile" onSubmit={submit}>
      <ShadcnInput label="Name" value="Ada" required onValueChange={() => undefined} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledWith());
  view.rerender(
    <ShadcnForm
      label="Profile"
      onSubmit={submit}
      submitting
      errors={[{ label: 'Network', message: 'Try again' }, { message: 'Unavailable' }]}
    >
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  expect(screen.getByRole('alert')).toHaveTextContent('Try again');
});

it('diagnoses nested forms through the selected SDK instead of throwing', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  render(
    <ShadcnForm label="Outer" onSubmit={() => undefined}>
      <ShadcnForm label="Inner" onSubmit={() => undefined} />
    </ShadcnForm>,
  );
  expect(screen.getAllByRole('form')).toHaveLength(1);
  expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested.');
  expect(error).not.toHaveBeenCalled();
  error.mockRestore();
});

it('rejects programmatic submission while the form is disabled', async () => {
  const submit = vi.fn();
  render(<ShadcnForm label="Profile" onSubmit={submit} disabled />);
  await act(async () => {
    fireEvent.submit(screen.getByRole('form', { name: 'Profile' }));
  });
  expect(submit).not.toHaveBeenCalled();
});

it('preserves busy form values and blocks repeated actions', async () => {
  const submit = vi.fn();
  const view = render(
    <ShadcnForm label="Busy" onSubmit={submit} submitting>
      <ShadcnInput label="Name" name="name" value="Ada" onValueChange={vi.fn()} />
    </ShadcnForm>,
  );
  const form = screen.getByRole('form', { name: 'Busy' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
  expect([...new FormData(form)]).toEqual([['name', 'Ada']]);
  expect(
    screen.getByRole('textbox', { name: 'Name' }).closest('fieldset'),
  ).toHaveAttribute('inert');
  fireEvent.submit(form);
  await waitFor(() => expect(submit).not.toHaveBeenCalled());
  view.rerender(
    <ShadcnForm label="Busy" onSubmit={submit} disabled>
      <ShadcnInput label="Name" name="name" value="Ada" onValueChange={vi.fn()} />
    </ShadcnForm>,
  );
  expect([...new FormData(form)]).toEqual([]);
});

it('closes SDK child portals without dropping enabled submitting values', async () => {
  const change = vi.fn();
  const content = (
    <ShadcnSelect
      label="Role"
      name="role"
      value="reader"
      onValueChange={change}
      items={[
        { value: 'reader', label: 'Reader' },
        { value: 'admin', label: 'Admin' },
      ]}
    />
  );
  const view = render(
    <ShadcnForm label="Settings" onSubmit={vi.fn()}>
      {content}
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Role' }));
  const option = await screen.findByRole('option', { name: 'Admin' });
  view.rerender(
    <ShadcnForm label="Settings" onSubmit={vi.fn()} submitting>
      {content}
    </ShadcnForm>,
  );
  await waitFor(() => expect(option).not.toBeVisible());
  const form = screen.getByRole('form', { name: 'Settings' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
  expect([...new FormData(form)]).toEqual([['role', 'reader']]);
  fireEvent.click(option);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnForm label="Settings" onSubmit={vi.fn()}>
      {content}
    </ShadcnForm>,
  );
  expect(screen.queryByRole('option', { name: 'Admin' })).toBeNull();
});
