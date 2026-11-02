import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnInputTime } from '../input-time/input-time.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

it('blocks partial date drafts instead of submitting an old value', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputDate
        label="Date"
        referenceDate="2024-02-28"
        value="2024-02-29"
        onValueChange={vi.fn()}
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('spinbutton', { name: /month/i }));
  await user.keyboard('{Backspace}');
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
  expect(document.activeElement).toHaveAttribute('role', 'spinbutton');
});

it('blocks readonly required time and host errors through SDK segments', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputTime
        label="Time"
        value={null}
        onValueChange={vi.fn()}
        required
        readOnly
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
  expect(submit).not.toHaveBeenCalled();
  expect(document.activeElement).toHaveAttribute('role', 'spinbutton');
  view.rerender(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnFormField name="date" error="Host rejection" description="Schedule review">
        <ShadcnInputDate
          label="Date"
          referenceDate="2024-02-28"
          value="2024-02-29"
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(
    screen
      .getAllByRole('alert')
      .some((alert) => alert.textContent?.includes('Host rejection')),
  ).toBe(true);
});

it('serializes SDK endpoints and preserves controlled requests', async () => {
  const date = vi.fn();
  const time = vi.fn();
  const submit = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputDate
        label="Dates"
        referenceDate="2024-02-28"
        mode="range"
        value={{ start: '2024-02-28', end: '2024-02-29' }}
        onValueChange={date}
        name="dates"
        min="2024-01-01"
        max="2024-12-31"
        description="Booking"
      />
      <ShadcnInputTime
        label="Times"
        mode="range"
        name="times"
        value={{ start: '09:00:00', end: '17:00:00' }}
        onValueChange={time}
        min="08:00:00"
        max="18:00:00"
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  const dateStart = screen.getByRole('group', { name: 'Dates Start' });
  const day = within(dateStart).getByRole('spinbutton', { name: /day/i });
  await user.click(day);
  await user.keyboard('{ArrowUp}');
  expect(date).toHaveBeenLastCalledWith({ start: '2024-02-29', end: '2024-02-29' });
  await user.click(screen.getByRole('button', { name: 'Clear Dates End' }));
  expect(date).toHaveBeenLastCalledWith({ start: '2024-02-28', end: null });
  await user.click(screen.getByRole('button', { name: 'Clear Times Start' }));
  expect(time).toHaveBeenLastCalledWith({ start: null, end: '17:00:00' });
  await user.click(screen.getByRole('button', { name: 'Clear Times End' }));
  expect(time).toHaveBeenLastCalledWith({ start: '09:00:00', end: null });
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([
    ['dates.start', '2024-02-28'],
    ['dates.end', '2024-02-29'],
    ['times.start', '09:00:00'],
    ['times.end', '17:00:00'],
  ]);
});

it('validates required endpoints for synthetic native submission', async () => {
  const submit = vi.fn();
  const view = render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputDate
        label="Date"
        referenceDate="2024-02-28"
        required
        readOnly
        value={null}
        onValueChange={vi.fn()}
      />
      <ShadcnInputTime
        label="Time"
        required
        readOnly
        value={null}
        onValueChange={vi.fn()}
      />
    </ShadcnForm>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  fireEvent.submit(form);
  await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(2));
  expect(submit).not.toHaveBeenCalled();
});

it('accepts optional empty fields and required complete values', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputTime label="Optional" value={null} onValueChange={vi.fn()} />
      <ShadcnInputDate
        label="Date"
        required
        referenceDate="2024-02-28"
        value="2024-02-29"
        onValueChange={vi.fn()}
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  view.rerender(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnInputTime label="Time" value={null} onValueChange={vi.fn()} />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('spinbutton', { name: /hour/i }));
  await user.keyboard('12');
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
  expect(submit).toHaveBeenCalledTimes(1);
});
