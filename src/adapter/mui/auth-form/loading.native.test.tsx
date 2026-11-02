import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiAuthForm } from './auth-form.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiSelect } from '../select/select.adapter.js';

it('disables loading credentials and blocks an open native Select', async () => {
  const submit = vi.fn();
  const provider = vi.fn();
  const changeEmail = vi.fn();
  const changeRole = vi.fn();
  function content(loading: boolean, email = 'a@b.test', role = 'reader') {
    return (
      <MuiAuthForm
        label="Sign in"
        submitLabel="Continue"
        onSubmit={submit}
        loading={loading}
        loadingLabel="Checking account"
        providers={[{ key: 'sso', label: 'Use SSO', onPress: provider }]}
      >
        <MuiInput
          label="Email"
          name="email"
          value={email}
          onValueChange={changeEmail}
        />
        <MuiSelect
          label="Role"
          name="role"
          value={role}
          onValueChange={changeRole}
          items={[
            { value: 'reader', label: 'Reader' },
            { value: 'editor', label: 'Editor' },
          ]}
        />
      </MuiAuthForm>
    );
  }
  const user = userEvent.setup();
  const view = render(content(false));
  const form = screen.getByRole('form', { name: 'Sign in' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  const input = screen.getByRole('textbox', { name: 'Email' });
  const select = screen.getByRole('combobox', { name: 'Role' });
  expect(input.closest('.MuiTextField-root')).not.toBeNull();
  expect(select.closest('.MuiSelect-root')).not.toBeNull();
  expect([...new FormData(form)]).toEqual([
    ['email', 'a@b.test'],
    ['role', 'reader'],
  ]);
  await user.click(select);
  const option = await screen.findByRole('option', { name: 'Editor' });
  view.rerender(content(true));
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  expect(input).toBeDisabled();
  expect(select).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getByRole('button', { name: 'Use SSO' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent('Checking account');
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(status.closest('[aria-busy="true"], [inert], form')).toBeNull();
  fireEvent.change(input, { target: { value: 'blocked@example.test' } });
  fireEvent.click(option);
  fireEvent.click(screen.getByRole('button', { name: 'Use SSO' }));
  fireEvent.submit(form);
  await user.keyboard('{Enter}');
  for (const callback of [submit, provider, changeEmail, changeRole]) {
    expect(callback).not.toHaveBeenCalled();
  }
  view.rerender(content(true, 'host@example.test', 'editor'));
  expect(input).toHaveValue('host@example.test');
  expect(select).toHaveTextContent('Editor');
  expect([...new FormData(form)]).toEqual([]);
  view.rerender(content(false, 'host@example.test', 'editor'));
  expect(input).not.toBeDisabled();
  expect(select).not.toHaveAttribute('aria-disabled', 'true');
  expect(screen.queryByRole('status')).toBeNull();
  expect([...new FormData(form)]).toEqual([
    ['email', 'host@example.test'],
    ['role', 'editor'],
  ]);
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  expect(screen.getByRole('form', { name: 'Sign in' })).toBeVisible();
  await user.click(select);
  await user.click(await screen.findByRole('option', { name: 'Reader' }));
  expect(changeRole).toHaveBeenCalledExactlyOnceWith('reader');
  expect(changeEmail).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Use SSO' }));
  expect(provider).toHaveBeenCalledExactlyOnceWith();
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
});
