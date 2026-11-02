import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiPinInput } from './pin-input.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { PortalActiveContext } from
  '../../../renderer/theme/portal-context.js';

function Code({ onComplete = vi.fn() }: { onComplete?: (value: string) => void }) {
  const [value, setValue] = useState('');
  return <MuiPinInput label="Code" value={value} onValueChange={setValue}
    onComplete={onComplete} name="code" separatorEvery={3} otp />;
}

it('uses one native Material input for typing, selection, paste and completion',
  async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    render(<Code onComplete={complete} />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input.closest('.MuiTextField-root')).toBeInTheDocument();
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByText(/Code format: ○○○–○○○/)).toBeVisible();
    await user.click(input);
    await user.paste('001234');
    expect(input).toHaveValue('001234');
    expect(complete).toHaveBeenCalledExactlyOnceWith('001234');
    fireEvent.change(input, { target: { value: '001234' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.change(input, { target: { value: '0012345' } });
    expect(input).toHaveValue('001234');
    expect(complete).toHaveBeenCalledTimes(1);
    await user.clear(input);
    expect(input).toHaveValue('');
  });

it('validates incomplete host values and focuses the actual SDK field on submit',
  async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const view = render(<MuiForm label="Verify" onSubmit={submit}>
      <MuiPinInput label="Code" value="12" onValueChange={vi.fn()} required />
      <MuiSubmitButton label="Submit" />
    </MuiForm>);
    fireEvent.submit(screen.getByRole('form', { name: 'Verify' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveFocus();
    expect(screen.getAllByText('Enter the complete code.').length).toBeGreaterThan(0);
    view.rerender(<MuiForm label="Verify" onSubmit={submit}>
      <MuiPinInput label="Code" value="001234" onValueChange={vi.fn()} required />
      <MuiSubmitButton label="Submit" />
    </MuiForm>);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submit).toHaveBeenCalledOnce();
  });

it('honors inherited errors, names and optional empty versus incomplete values', () => {
  const submit = vi.fn();
  const complete = vi.fn();
  const contents = (value: string, error: string) => (
    <MuiForm label="Verify" onSubmit={submit}>
      <MuiFormField label="Security" name="code" error={error}>
        <MuiPinInput label="Code" value={value} onValueChange={vi.fn()}
          onComplete={complete} description="From your message." />
      </MuiFormField>
    </MuiForm>
  );
  const view = render(contents('001234', 'Invalid host code.'));
  fireEvent.submit(screen.getByRole('form', { name: 'Verify' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Code' })).toHaveAttribute('name', 'code');
  expect(complete).not.toHaveBeenCalled();
  view.rerender(contents('', ''));
  fireEvent.submit(screen.getByRole('form', { name: 'Verify' }));
  expect(submit).toHaveBeenCalledOnce();
  view.rerender(contents('1', ''));
  fireEvent.submit(screen.getByRole('form', { name: 'Verify' }));
  expect(submit).toHaveBeenCalledOnce();
});

it('protects canonical fields across form interaction states', () => {
  const write = vi.fn();
  const complete = vi.fn();
  const view = render(<MuiPinInput label="Code" value="A1" length={2}
    inputType="alphanumeric" mask readOnly onValueChange={write} />);
  const input = screen.getByLabelText('Code');
  expect(input).toHaveAttribute('type', 'password');
  expect(input).toHaveAttribute('autocomplete', 'off');
  expect(input).toHaveAttribute('inputmode', 'text');
  fireEvent.change(input, { target: { value: 'B2' } });
  expect(write).not.toHaveBeenCalled();
  const contents = (submitting: boolean, disabled: boolean, active: boolean) => (
    <PortalActiveContext value={active}>
      <MuiForm label="Verify" submitting={submitting} onSubmit={vi.fn()}>
        <MuiPinInput label="Code" name="code" value="001234" disabled={disabled}
          onValueChange={write} onComplete={complete} />
      </MuiForm>
    </PortalActiveContext>
  );
  for (const [pending, disabled, active] of [
    [true, false, true], [false, true, true], [false, false, false],
  ] as const) {
    view.rerender(contents(pending, disabled, active));
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: '123456' } });
    const form = screen.getByRole('form', { name: 'Verify' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
    expect([...new FormData(form)]).toEqual(pending ? [['code', '001234']] : []);
  }
  expect(write).not.toHaveBeenCalled();
  expect(complete).not.toHaveBeenCalled();
});
