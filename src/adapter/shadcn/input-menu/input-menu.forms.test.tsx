import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputMenu } from './input-menu.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('revalidates required readonly text after a canonical host update', async () => {
  const submit = vi.fn();
  const contents = (value: string) => (
    <ShadcnForm label="Journey" onSubmit={submit}>
      <ShadcnInputMenu
        label="City"
        value={value}
        required
        readOnly
        name="city"
        items={[]}
        onValueChange={vi.fn()}
        description="Destination city"
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>
  );
  const view = render(contents(''));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'City' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter text');
  view.rerender(contents('Vienna'));
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  const form = screen.getByRole('form', { name: 'Journey' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing SDK form.');
  expect(Array.from(new FormData(form))).toEqual([['city', 'Vienna']]);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('registers editable native input requests with the SDK form', async () => {
  const submit = vi.fn();
  render(
    <ShadcnForm label="Journey" onSubmit={submit}>
      <ShadcnInputMenu label="City" value="Vienna" items={[]} onValueChange={vi.fn()} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.type(screen.getByRole('combobox', { name: 'City' }), 'x');
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('inherits field errors and clears obsolete validation feedback', async () => {
  const submit = vi.fn();
  const contents = (error?: string) => (
    <ShadcnForm label="Journey" onSubmit={submit}>
      <ShadcnFormField name="city" error={error} description="Journey destination">
        <ShadcnInputMenu
          label="City"
          value="Vienna"
          items={[]}
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>
  );
  const view = render(contents('Journey is locked.'));
  const input = screen.getByRole('combobox', { name: 'City' });
  expect(input).toHaveAccessibleDescription('Journey destination Journey is locked.');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(input).toHaveFocus();
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  view.rerender(contents());
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  expect(input).toHaveAttribute('aria-invalid', 'false');
});
