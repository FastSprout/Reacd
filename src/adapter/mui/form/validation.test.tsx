import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { useFormConstraint } from
  '../../../renderer/form-validation/use-form-constraint.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiTextarea } from '../textarea/textarea.adapter.js';
import { MuiInputNumber } from '../input-number/input-number.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { MuiForm } from './form.adapter.js';

it.each(['readOnly', 'loading'] as const)(
  'validates required %s host values before logical submission',
  async (mode) => {
    const submit = vi.fn<() => void>();
    const view = render(
      <MuiForm label="Contact" onSubmit={submit}>
        <MuiInput
          label="Name"
          value=""
          required
          readOnly={mode === 'readOnly'}
          loading={mode === 'loading'}
          onValueChange={() => undefined}
        />
        <MuiSubmitButton label="Save" />
      </MuiForm>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
    view.rerender(
      <MuiForm label="Contact" onSubmit={submit}>
        <MuiInput
          label="Name"
          value="Ada"
          required
          readOnly
          onValueChange={() => undefined}
        />
        <MuiSubmitButton label="Save" />
      </MuiForm>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledWith();
  },
);
it('validates programmatic length and readonly email values', async () => {
  const submit = vi.fn<() => void>();
  const view = render(
    <MuiForm label="Contact" onSubmit={submit}>
      <MuiInput label="Name" value="A" minLength={3} onValueChange={() => undefined} />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 3 characters.');
  view.rerender(
    <MuiForm label="Contact" onSubmit={submit}>
      <MuiInput
        label="Email"
        value="draft"
        inputType="email"
        readOnly
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
});
it('validates readonly multiline values and skips disabled fields', async () => {
  const submit = vi.fn<() => void>();
  const view = render(
    <MuiForm label="Notes" onSubmit={submit}>
      <MuiTextarea
        label="Notes"
        value="A"
        minLength={3}
        readOnly
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
  view.rerender(
    <MuiForm label="Notes" onSubmit={submit}>
      <MuiTextarea
        label="Notes"
        value="A"
        minLength={3}
        readOnly
        disabled
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledWith();
});
it('focuses the SDK number input for a required readonly value', async () => {
  const submit = vi.fn<() => void>();
  render(
    <MuiForm label="Quantity" onSubmit={submit}>
      <MuiInputNumber
        label="Quantity"
        value={null}
        required
        readOnly
        onValueChange={() => undefined}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveFocus();
});
function ConstraintWithoutFocus() {
  const constraint = { id: 'external', label: 'External', getMessage: () => 'Invalid' };
  useFormConstraint(constraint, false);
  return null;
}
it('reports registered issues without requiring a DOM focus mechanism', async () => {
  const submit = vi.fn<() => void>();
  render(
    <MuiForm label="External" onSubmit={submit}>
      <ConstraintWithoutFocus />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid');
});

it('isolates constraint registries for independent native forms', async () => {
  const invalid = vi.fn<() => void>();
  const valid = vi.fn<() => void>();
  render(
    <>
      <MuiForm label="Invalid" onSubmit={invalid}>
        <MuiInput
          label="Invalid name"
          value=""
          required
          readOnly
          onValueChange={() => undefined}
        />
        <MuiSubmitButton label="Save invalid" />
      </MuiForm>
      <MuiForm label="Valid" onSubmit={valid}>
        <MuiInput
          label="Valid name"
          value="Ada"
          required
          readOnly
          onValueChange={() => undefined}
        />
        <MuiSubmitButton label="Save valid" />
      </MuiForm>
    </>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save valid' }));
  expect(valid).toHaveBeenCalledWith();
  expect(invalid).not.toHaveBeenCalled();
});
