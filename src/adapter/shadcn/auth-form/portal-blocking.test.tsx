import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm, FormField, ReacdProvider, Select } from '../../../index.js';

describe('AuthForm portalled field blocking', () => {
  it.each(['loading', 'disabled'] as const)(
    'blocks an already-open Select when %s changes',
    async (flag) => {
      const user = userEvent.setup();
      const change = vi.fn();
      const form = (blocked: boolean) => (
        <ReacdProvider adapter={shadcnAdapter}>
          <AuthForm
            label="Portalled credentials"
            submitLabel="Submit credentials"
            onSubmit={vi.fn()}
            loading={flag === 'loading' && blocked}
            disabled={flag === 'disabled' && blocked}
          >
            <Select
              label="Credential role"
              value="reader"
              disabled={false}
              onValueChange={change}
              items={[
                { value: 'reader', label: 'Reader' },
                { value: 'admin', label: 'Administrator' },
              ]}
            />
          </AuthForm>
        </ReacdProvider>
      );
      const view = render(form(false));
      await user.click(screen.getByRole('combobox', { name: 'Credential role' }));
      const option = await screen.findByRole('option', { name: 'Administrator' });
      view.rerender(form(true));
      await user.click(option);
      expect(change).not.toHaveBeenCalled();
      await user.keyboard('{Escape}');
      await waitFor(() => expect(option).not.toBeVisible());
      view.rerender(form(false));
      await user.click(screen.getByRole('combobox', { name: 'Credential role' }));
      await user.click(await screen.findByRole('option', { name: 'Administrator' }));
      expect(change).toHaveBeenCalledExactlyOnceWith('admin');
    },
  );

  it('preserves nested field metadata and explicit child overrides', () => {
    const change = vi.fn();
    const items = [{ value: 'reader', label: 'Reader' }];
    const form = (blocked: boolean) => (
      <ReacdProvider adapter={shadcnAdapter}>
        <FormField
          name="outer"
          required
          description="Outer description"
          error="Outer error"
        >
          <AuthForm
            label="Metadata credentials"
            submitLabel="Submit credentials"
            onSubmit={vi.fn()}
            loading={blocked}
          >
            <FormField name="inner" help="Inner help">
              <Select
                label="Explicit metadata"
                name="explicit"
                required={false}
                disabled={false}
                value="reader"
                items={items}
                onValueChange={change}
              />
              <Select
                label="Inherited metadata"
                value="reader"
                items={items}
                onValueChange={change}
              />
            </FormField>
          </AuthForm>
        </FormField>
      </ReacdProvider>
    );
    const view = render(form(true));
    const explicit = screen.getByRole('combobox', { name: 'Explicit metadata' });
    const inherited = screen.getByRole('combobox', { name: 'Inherited metadata' });
    expect(explicit).toBeDisabled();
    expect(inherited).toBeDisabled();
    expect(explicit).not.toHaveAttribute('aria-required');
    expect(inherited).toHaveAttribute('aria-required', 'true');
    expect(explicit).toHaveAccessibleDescription(
      'Outer description Outer error Inner help',
    );
    expect(explicit).toHaveAttribute('aria-invalid', 'true');
    expect(inherited).toHaveAttribute('aria-invalid', 'true');
    const nativeForm = screen.getByRole('form');
    if (!(nativeForm instanceof HTMLFormElement)) {
      throw new Error('Expected native credential form.');
    }
    expect([...new FormData(nativeForm)]).toEqual([]);
    view.rerender(form(false));
    expect(explicit).not.toBeDisabled();
    expect(inherited).not.toBeDisabled();
    expect(explicit).not.toHaveAttribute('aria-required');
    expect(inherited).toHaveAttribute('aria-required', 'true');
    expect([...new FormData(nativeForm)]).toEqual([
      ['explicit', 'reader'],
      ['inner', 'reader'],
    ]);
  });
});
