import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiForm } from './form.adapter.js';
import { MuiInputDate } from '../input-date/input-date.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { MuiCheckbox } from '../checkbox/checkbox.adapter.js';

it('routes required date native invalidity through SDK focus and summary', async () => {
  const submit = vi.fn();
  render(
    <MuiForm label="Dates" onSubmit={submit}>
      <MuiInputDate
        label="Event"
        name="event"
        value={null}
        required
        referenceDate="2024-02-28"
        onValueChange={vi.fn()}
      />
      <MuiSubmitButton label="Save dates" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save dates' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('spinbutton', { name: 'Month' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
});

it('keeps native invalid focus for controls without a registered constraint', () => {
  const submit = vi.fn();
  render(
    <MuiForm label="Consent" onSubmit={submit}>
      <MuiCheckbox
        label="Accept terms"
        checked={false}
        required
        onCheckedChange={vi.fn()}
      />
    </MuiForm>,
  );
  const accepted = fireEvent.invalid(screen.getByRole('checkbox'));
  expect(accepted).toBe(true);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});

it('cancels invalid focus while the native form is blocked', () => {
  const submit = vi.fn();
  render(
    <MuiForm label="Consent" onSubmit={submit} submitting>
      <MuiCheckbox
        label="Accept terms"
        checked={false}
        required
        onCheckedChange={vi.fn()}
      />
    </MuiForm>,
  );
  const input = screen.getByRole('checkbox', { hidden: true });
  expect(fireEvent.invalid(input)).toBe(false);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});

it('rejects a partial date through its canonical required constraint', async () => {
  const submit = vi.fn();
  function Dates() {
    const [date, setDate] = useState<string | null>('2024-02-28');
    return (
      <MuiForm label="Dates" onSubmit={submit}>
        <MuiInputDate
          label="Event"
          name="event"
          value={date}
          required
          referenceDate="2024-02-28"
          onValueChange={setDate}
        />
        <MuiSubmitButton label="Save dates" />
      </MuiForm>
    );
  }
  render(<Dates />);
  const month = screen.getByRole('spinbutton', { name: 'Month' });
  await userEvent.click(month);
  await userEvent.keyboard('{Backspace}');
  expect(month).toHaveTextContent('MM');
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
  expect(new FormData(form).get('event')).toBe('');
  await userEvent.click(screen.getByRole('button', { name: 'Save dates' }));
  expect(submit).not.toHaveBeenCalled();
  expect(month).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
});
