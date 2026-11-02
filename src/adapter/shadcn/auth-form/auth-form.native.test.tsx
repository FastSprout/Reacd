import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnAuthForm } from './auth-form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnText } from '../text/text.adapter.js';

it('uses SDK form validation and independent provider buttons', async () => {
  const save = vi.fn();
  const provider = vi.fn();
  const user = userEvent.setup();
  function Sample() {
    const [value, setValue] = useState('');
    return (
      <ShadcnAuthForm
        label="Sign in"
        title="Welcome"
        description="Use your email"
        submitLabel="Continue"
        onSubmit={save}
        leading={<ShadcnText>Brand</ShadcnText>}
        header={<ShadcnText>Header</ShadcnText>}
        footer={<ShadcnText>Footer</ShadcnText>}
        separatorLabel="Or use email"
        providers={[
          { key: 'sso', label: 'Use SSO', onPress: provider },
          { key: 'blocked', label: 'Unavailable', onPress: provider, disabled: true },
        ]}
      >
        <ShadcnInput
          label="Email"
          value={value}
          onValueChange={setValue}
          required
          inputType="email"
        />
      </ShadcnAuthForm>
    );
  }
  render(<Sample />);
  expect(screen.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  for (const text of ['Brand', 'Header', 'Footer', 'Use your email', 'Or use email']) {
    expect(screen.getByText(text)).toBeVisible();
  }
  await user.click(screen.getByRole('button', { name: 'Use SSO' }));
  expect(provider).toHaveBeenCalledExactlyOnceWith();
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(save).not.toHaveBeenCalled();
  await user.type(screen.getByRole('textbox'), 'reader@example.com');
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(save).toHaveBeenCalledExactlyOnceWith();
});

it('blocks loading and disabled forms without hiding the status', async () => {
  const save = vi.fn();
  const provider = vi.fn();
  const view = render(
    <ShadcnAuthForm
      label="Sign in"
      submitLabel="Continue"
      onSubmit={save}
      loading
      error="Try again"
      loadingLabel="Checking credentials"
      providers={[{ key: 'sso', label: 'Use SSO', onPress: provider }]}
    >
      <ShadcnInput label="Email" value="" onValueChange={vi.fn()} />
    </ShadcnAuthForm>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Try again');
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent('Checking credentials');
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(status.closest('[inert]')).toBeNull();
  expect(status.closest('[aria-busy="true"]')).toBeNull();
  expect(screen.getByRole('button', { name: 'Use SSO' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  fireEvent.submit(screen.getByRole('form', { name: 'Sign in' }));
  expect(save).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnAuthForm label="Sign in" submitLabel="Continue" onSubmit={save} disabled />,
  );
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  view.rerender(
    <ShadcnAuthForm label="Sign in" submitLabel="Continue" onSubmit={save} loading />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Submitting');
});
