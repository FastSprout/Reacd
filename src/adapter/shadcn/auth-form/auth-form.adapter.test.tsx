import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm, Input, ReacdProvider, Text } from '../../../index.js';

describe('AuthForm adapter', () => {
  it('submits credentials separately from provider actions', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const provider = vi.fn();
    render(
      <ReacdProvider>
        <AuthForm
          label="Local credentials"
          title="Local example"
          description="No credentials leave this page."
          submitLabel="Submit example"
          onSubmit={submit}
          leading={<Text>Example mark</Text>}
          header={<Text>Example header</Text>}
          footer={<Text>Example footer</Text>}
          separatorLabel="Or use local fields"
          error="Example server validation error"
          providers={[
            {
              key: 'local',
              label: 'Use local provider',
              onPress: provider,
            },
          ]}
        >
          <Input
            label="Email"
            inputType="email"
            value="test@example.com"
            required
            onValueChange={vi.fn()}
          />
        </AuthForm>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Use local provider' }));
    expect(provider).toHaveBeenCalledExactlyOnceWith();
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit example' }));
    expect(submit).toHaveBeenCalledExactlyOnceWith();
    expect(screen.getByRole('alert')).toHaveTextContent('Example server');
    expect(screen.getByRole('heading')).toHaveTextContent('Local example');
  });

  it('guards direct submissions while busy or disabled', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const provider = vi.fn();
    const props = {
      label: 'Blocked form',
      submitLabel: 'Submit',
      onSubmit: submit,
      providers: [{ key: 'local', label: 'Provider', onPress: provider }],
    };
    const view = render(
      <ReacdProvider>
        <AuthForm {...props} loading />
      </ReacdProvider>,
    );
    fireEvent.submit(screen.getByRole('form'));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Submitting');
    expect(screen.getByRole('status').closest('[aria-busy="true"]')).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Provider' }).closest('fieldset'),
    ).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Provider' })).toBeDisabled();
    view.rerender(
      <ReacdProvider>
        <AuthForm {...props} disabled />
      </ReacdProvider>,
    );
    fireEvent.submit(screen.getByRole('form'));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
    view.rerender(
      <ReacdProvider>
        <AuthForm {...props} loading loadingLabel="Checking local example" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Checking local example');
    view.rerender(
      <ReacdProvider>
        <AuthForm
          {...props}
          providers={[
            {
              key: 'local',
              label: 'Provider',
              onPress: provider,
              disabled: true,
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Provider' }));
    expect(provider).not.toHaveBeenCalled();
    expect(
      renderToString(
        <ReacdProvider>
          <AuthForm {...props} />
        </ReacdProvider>,
      ),
    ).toContain('reacd-auth-form');
  });
});
