import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { ShadcnPinInput } from '../pin-input/pin-input.adapter.js';
import { ShadcnFormField } from './form-field.adapter.js';

it.each([
  {
    role: 'checkbox',
    label: 'Approval',
    control: <ShadcnCheckbox label="Approval" checked
      onCheckedChange={() => undefined} />,
  },
  {
    role: 'textbox',
    label: 'Code',
    control: <ShadcnPinInput label="Code" value="123456"
      onValueChange={() => undefined} />,
  },
])('rejects and clears a host error for $label', async ({ role, label, control }) => {
  const submit = vi.fn();
  const form = (error: string) => <ShadcnForm label="Review" onSubmit={submit}>
    <ShadcnFormField name="approval" error={error}>{control}</ShadcnFormField>
    <ShadcnSubmitButton label="Save" />
  </ShadcnForm>;
  const view = render(form('Review is required.'));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByRole(role, { name: label })).toHaveFocus());
  expect(submit).not.toHaveBeenCalled();
  view.rerender(form(''));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
});
