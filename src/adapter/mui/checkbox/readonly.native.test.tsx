import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { MuiCheckbox } from './checkbox.adapter.js';

it('validates readonly mixed approval and preserves native data', async () => {
  const submit = vi.fn<() => void>();
  const change = vi.fn<(value: boolean) => void>();
  const content = (mixed: boolean, disabled = false) => (
    <MuiForm label="Approval" onSubmit={submit}>
      <MuiFormField name="approval" required disabled={disabled}>
        <MuiCheckbox
          label="Approve accounts"
          checked
          indeterminate={mixed}
          value="approved"
          readOnly
          onCheckedChange={change}
        />
      </MuiFormField>
      <MuiSubmitButton label="Save approval" />
    </MuiForm>
  );
  const view = render(content(true));
  const field = screen.getByRole('checkbox', { name: 'Approve accounts' });
  const form = screen.getByRole('form', { name: 'Approval' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  expect(field).toHaveAttribute('aria-readonly', 'true');
  expect(field).not.toHaveAttribute('readonly');
  expect(field).toHaveProperty('willValidate', true);
  expect(form.checkValidity()).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(submit).not.toHaveBeenCalled();
  await userEvent.click(field);
  expect(change).not.toHaveBeenCalled();
  expect(new FormData(form).getAll('approval')).toEqual([]);
  view.rerender(content(false));
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll('approval')).toEqual(['approved']);
  await userEvent.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
  view.rerender(content(true, true));
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll('approval')).toEqual([]);
});
