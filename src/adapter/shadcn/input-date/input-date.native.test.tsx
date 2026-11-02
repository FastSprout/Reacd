import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputDate } from './input-date.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';

it('uses native segmented dates and emits canonical controlled changes', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnInputDate
      label="Date"
      referenceDate="2024-02-28"
      value="2024-02-29"
      onValueChange={change}
      name="date"
    />,
  );
  const day = screen.getByRole('spinbutton', { name: /day/i });
  await user.click(day);
  await user.keyboard('{ArrowDown}');
  expect(change).toHaveBeenLastCalledWith('2024-02-28');
  const input = view.container.querySelector('input[name="date"]');
  expect(input).toHaveAttribute('value', '2024-02-29');
  await user.click(screen.getByRole('button', { name: 'Clear Date' }));
  expect(change).toHaveBeenLastCalledWith(null);
});

it('uses native required feedback and segment focus inside SDK Form', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  render(
    <ShadcnForm label="Date form" onSubmit={submit}>
      <ShadcnInputDate
        label="Date"
        referenceDate="2024-02-28"
        value={null}
        onValueChange={vi.fn()}
        required
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
  expect(document.activeElement).toHaveAttribute('role', 'spinbutton');
});
