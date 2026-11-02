import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { MuiCheckbox } from './checkbox.adapter.js';
it('uses native checkbox mixed state and logical changes', async () => {
  const change = vi.fn<(value: boolean) => void>();
  const view = render(
    <MuiCheckbox
      label="Summary"
      checked={false}
      indeterminate
      onCheckedChange={change}
      description="Weekly email"
    />,
  );
  const field = screen.getByRole('checkbox', { name: 'Summary' });
  expect(field.closest('.MuiCheckbox-root')).not.toBeNull();
  expect(field).toHaveAttribute('data-indeterminate', 'true');
  expect(field).toHaveAccessibleDescription('Weekly email');
  await userEvent.click(field);
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <MuiCheckbox label="Summary" checked={false} onCheckedChange={change} readOnly />,
  );
  await userEvent.click(field);
  expect(change).toHaveBeenCalledTimes(1);
});

it.each([
  { checked: false, indeterminate: false, aria: 'false' },
  { checked: true, indeterminate: false, aria: 'true' },
  { checked: false, indeterminate: true, aria: 'mixed' },
  { checked: true, indeterminate: true, aria: 'mixed' },
])('exposes controlled checkbox accessibility state $aria', (state) => {
  render(
    <MuiCheckbox
      label="Approval"
      checked={state.checked}
      indeterminate={state.indeterminate}
      onCheckedChange={() => undefined}
    />,
  );
  const field = screen.getByRole('checkbox', { name: 'Approval' });
  expect(field).toHaveAttribute('aria-checked', state.aria);
  expect(field).toHaveProperty('checked', state.checked && !state.indeterminate);
});

it('keeps mixed host approval out of native data and required submission', async () => {
  const submit = vi.fn<() => void>();
  const change = vi.fn<(value: boolean) => void>();
  function approval(mixed: boolean) {
    return (
      <MuiForm label="Approval" onSubmit={submit}>
        <MuiFormField name="approval" required>
          <MuiCheckbox
            label="Approve accounts"
            checked
            indeterminate={mixed}
            value="approved"
            onCheckedChange={change}
          />
        </MuiFormField>
        <MuiSubmitButton label="Save approval" />
      </MuiForm>
    );
  }
  const view = render(approval(true));
  const field = screen.getByRole('checkbox', { name: 'Approve accounts' });
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected native approval form.');
  expect(new FormData(form).getAll('approval')).toEqual([]);
  expect(form.checkValidity()).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(submit).not.toHaveBeenCalled();
  await userEvent.click(field);
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  view.rerender(approval(false));
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll('approval')).toEqual(['approved']);
  await userEvent.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
});

it('exposes inherited host feedback without replacing its native control', () => {
  render(
    <FieldMetadataContext
      value={{
        name: 'approval',
        required: true,
        disabled: true,
        error: 'Approval was rejected.',
        descriptionIds: [],
      }}
    >
      <MuiCheckbox label="Approval" checked onCheckedChange={() => undefined} />
    </FieldMetadataContext>,
  );
  const field = screen.getByRole('checkbox', { name: 'Approval' });
  expect(field).toBeDisabled();
  expect(field).toHaveProperty('required', true);
  expect(field).toHaveAttribute('aria-invalid', 'true');
  expect(field).toHaveAccessibleDescription('Approval was rejected.');
});
