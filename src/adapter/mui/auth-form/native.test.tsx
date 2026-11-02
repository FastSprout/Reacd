import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiAuthForm } from './auth-form.adapter.js';
import { MuiInput } from '../input/input.adapter.js';

it('keeps provider actions distinct and enforces native credentials', async () => {
  const submit = vi.fn();
  const provider = vi.fn();
  function Example() {
    const [email, change] = useState('');
    return (
      <MuiAuthForm
        label="Sign in"
        submitLabel="Continue"
        onSubmit={submit}
        title="Welcome"
        description="Use your account"
        leading="Brand"
        header="Header slot"
        footer="Footer slot"
        separatorLabel="Or email"
        error="Session expired"
        providers={[
          { key: 'sso', label: 'Use SSO', onPress: provider, intent: 'secondary' },
          { key: 'off', label: 'Unavailable', onPress: provider, disabled: true },
        ]}
      >
        <MuiInput
          label="Email"
          name="email"
          inputType="email"
          required
          value={email}
          onValueChange={change}
        />
      </MuiAuthForm>
    );
  }
  const view = render(<Example />);
  expect(screen.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  for (const text of [
    'Brand',
    'Use your account',
    'Header slot',
    'Footer slot',
    'Or email',
  ])
    expect(view.container).toHaveTextContent(text);
  expect(screen.getByRole('alert')).toHaveTextContent('Session expired');
  await userEvent.click(screen.getByRole('button', { name: 'Use SSO' }));
  expect(provider).toHaveBeenCalledExactlyOnceWith();
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
  expect(submit).not.toHaveBeenCalled();
  await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.test');
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  expect(view.container.querySelector('.MuiCard-root')).not.toBeNull();
});

it('excludes both loading and disabled credentials from native data', async () => {
  const submit = vi.fn();
  const provider = vi.fn();
  const content = (loading: boolean, disabled: boolean) => (
    <MuiAuthForm
      label="Sign in"
      submitLabel="Continue"
      onSubmit={submit}
      loading={loading}
      disabled={disabled}
      providers={[{ key: 'sso', label: 'SSO', onPress: provider }]}
    >
      <MuiInput label="Email" name="email" value="a@b.test" onValueChange={vi.fn()} />
    </MuiAuthForm>
  );
  const view = render(content(true, false));
  expect(screen.getByRole('status')).toHaveTextContent('Submitting');
  const form = screen.getByRole('form', { name: 'Sign in' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form');
  expect([...new FormData(form)]).toEqual([]);
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'SSO' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'SSO' }));
  expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  expect(provider).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
  view.rerender(content(false, true));
  expect([...new FormData(form)]).toEqual([]);
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
});

it('supports an unadorned form and custom loading feedback', () => {
  const view = render(
    <MuiAuthForm label="Account" submitLabel="Save" onSubmit={vi.fn()} />,
  );
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.queryByRole('status')).toBeNull();
  view.rerender(
    <MuiAuthForm
      label="Account"
      submitLabel="Save"
      loading
      loadingLabel="Checking credentials"
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Checking credentials');
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(screen.getByRole('status').closest('[aria-busy="true"], [inert]')).toBeNull();
});
