import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from './form-field.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiCheckbox } from '../checkbox/checkbox.adapter.js';
import { MuiSelect } from '../select/select.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';

const controls: readonly {
  name: string;
  role: 'textbox' | 'checkbox' | 'combobox';
  view: ReactElement;
  value: string;
}[] = [
  {
    name: 'Name',
    role: 'textbox',
    value: 'Ada',
    view: <MuiInput label="Name" value="Ada" onValueChange={() => undefined} />,
  },
  {
    name: 'Approval',
    role: 'checkbox',
    value: 'approved',
    view: (
      <MuiCheckbox
        label="Approval"
        checked
        value="approved"
        onCheckedChange={() => undefined}
      />
    ),
  },
  {
    name: 'Role',
    role: 'combobox',
    value: 'reader',
    view: (
      <MuiSelect
        label="Role"
        value="reader"
        items={[{ value: 'reader', label: 'Reader' }]}
        onValueChange={() => undefined}
      />
    ),
  },
];

it.each(controls)(
  'blocks $name host errors and focuses its actual SDK control',
  async ({ name, role, view, value }) => {
    const submit = vi.fn<() => void>();
    const rendered = render(
      <MuiForm label="Review" onSubmit={submit}>
        <MuiFormField name="field" error="Rejected">
          {view}
        </MuiFormField>
        <MuiSubmitButton label="Save" />
      </MuiForm>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole(role, { name })).toHaveFocus();
    const form = rendered.container.querySelector('form');
    if (!form) throw new Error('Expected native review form.');
    expect([...new FormData(form)]).toEqual([['field', value]]);
    const summary = screen.getByRole('alert');
    expect(summary.querySelectorAll('.MuiListItem-root')).toHaveLength(1);
    rendered.rerender(
      <MuiForm label="Review" onSubmit={submit}>
        <MuiFormField name="field" error="">
          {view}
        </MuiFormField>
        <MuiSubmitButton label="Save" />
      </MuiForm>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  },
);

it('keeps invalid field order across error and label changes', async () => {
  const submit = vi.fn<() => void>();
  function content(firstError: string, secondDisabled = false) {
    return (
      <MuiForm label="Review" onSubmit={submit}>
        <MuiFormField
          name="first"
          label={firstError ? 'First invalid' : 'First'}
          error={firstError}
        >
          <MuiInput
            label="First name"
            value="Ada"
            readOnly
            onValueChange={() => undefined}
          />
        </MuiFormField>
        <MuiFormField name="second" error="Second rejected" disabled={secondDisabled}>
          <MuiInput label="Second name" value="Grace" onValueChange={() => undefined} />
        </MuiFormField>
        <MuiSubmitButton label="Save" />
      </MuiForm>
    );
  }
  const view = render(content(''));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('textbox', { name: 'Second name' })).toHaveFocus();
  view.rerender(content('First rejected'));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus();
  expect(submit).not.toHaveBeenCalled();
  view.rerender(content('', true));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('avoids duplicate inherited errors in nested groups', async () => {
  render(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiFormField name="outer" error="Rejected">
        <MuiFormField name="inner">
          <MuiInput label="Name" value="Ada" onValueChange={() => undefined} />
        </MuiFormField>
      </MuiFormField>
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  expect(screen.getByRole('alert').querySelectorAll('.MuiListItem-root')).toHaveLength(
    1,
  );
});

it('restores first-invalid order when a field is enabled', async () => {
  const submit = vi.fn<() => void>();
  function content(disabled: boolean) {
    return (
      <MuiForm label="Review" onSubmit={submit}>
        <MuiFormField name="first" error="First rejected" disabled={disabled}>
          <MuiCheckbox label="First" checked onCheckedChange={() => undefined} />
        </MuiFormField>
        <MuiFormField name="second" error="Second rejected">
          <MuiInput label="Second" value="Ada" onValueChange={() => undefined} />
        </MuiFormField>
        <MuiSubmitButton label="Save" />
      </MuiForm>
    );
  }
  const view = render(content(true));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('textbox', { name: 'Second' })).toHaveFocus();
  view.rerender(content(false));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('checkbox', { name: 'First' })).toHaveFocus();
  expect(submit).not.toHaveBeenCalled();
});

it('removes unmounted declarations without affecting another form', async () => {
  const first = vi.fn<() => void>();
  const second = vi.fn<() => void>();
  function content(mounted: boolean) {
    return (
      <>
        <MuiForm label="First" onSubmit={first}>
          {mounted && (
            <MuiFormField name="name" error="Rejected">
              <MuiInput
                label="First name"
                value="Ada"
                onValueChange={() => undefined}
              />
            </MuiFormField>
          )}
          <MuiSubmitButton label="Save first" />
        </MuiForm>
        <MuiForm label="Second" onSubmit={second}>
          <MuiFormField name="name">
            <MuiInput
              label="Second name"
              value="Grace"
              onValueChange={() => undefined}
            />
          </MuiFormField>
          <MuiSubmitButton label="Save second" />
        </MuiForm>
      </>
    );
  }
  const view = render(content(true));
  await userEvent.click(screen.getByRole('button', { name: 'Save second' }));
  expect(second).toHaveBeenCalledExactlyOnceWith();
  expect(first).not.toHaveBeenCalled();
  view.rerender(content(false));
  await userEvent.click(screen.getByRole('button', { name: 'Save first' }));
  expect(first).toHaveBeenCalledExactlyOnceWith();
});
