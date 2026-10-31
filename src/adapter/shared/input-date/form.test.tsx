import { useState } from 'react';
import type { FormEvent } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedInputDate } from './input-date.adapter.js';

const referenceDate = '2024-02-28';

it('requires both date endpoints and submits canonical native dates', async () => {
  const user = userEvent.setup();
  const submitted = vi.fn();
  function Example() {
    const [value, setValue] = useState<
      Readonly<{
        start: string | null;
        end: string | null;
      }>
    >({ start: '2024-02-28', end: null });
    function submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      submitted(Object.fromEntries(new FormData(event.currentTarget)));
    }
    return (
      <form onSubmit={submit}>
        <SharedInputDate
          label="Booking"
          referenceDate={referenceDate}
          mode="range"
          name="booking"
          required
          value={value}
          onValueChange={setValue}
        />
        <button
          type="button"
          onClick={() => setValue({ start: null, end: '2024-03-01' })}
        >
          Keep end date
        </button>
        <button
          type="button"
          onClick={() => setValue({ start: '2024-02-28', end: '2024-03-01' })}
        >
          Fill dates
        </button>
        <button type="submit">Save booking</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Save booking' }));
  expect(submitted).not.toHaveBeenCalled();
  expect(screen.getByRole('spinbutton', { name: /month, End Booking/i })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Keep end date' }));
  await user.click(screen.getByRole('button', { name: 'Save booking' }));
  expect(submitted).not.toHaveBeenCalled();
  expect(
    screen.getByRole('spinbutton', { name: /month, Start Booking/i }),
  ).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Fill dates' }));
  await user.click(screen.getByRole('button', { name: 'Save booking' }));
  expect(submitted).toHaveBeenCalledExactlyOnceWith({
    'booking.start': '2024-02-28',
    'booking.end': '2024-03-01',
  });
});

it('blocks committed partial dates and announces the missing segment', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <SharedInputDate
        label="Existing date"
        referenceDate={referenceDate}
        value="2024-02-28"
        required
        onValueChange={vi.fn()}
      />
      <button type="submit">Save existing date</button>
    </form>,
  );
  const month = screen.getByRole('spinbutton', { name: /month, Existing date/i });
  month.focus();
  await user.keyboard('{Backspace}');
  expect(month).not.toHaveAttribute('aria-valuenow');
  await user.click(screen.getByRole('button', { name: 'Save existing date' }));
  expect(submit).not.toHaveBeenCalled();
  expect(month).toHaveFocus();
  expect(month).toHaveAccessibleDescription(/Complete all date segments/);
});

it('allows optional empty dates but blocks a nonempty incomplete draft', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <SharedInputDate
        label="Optional date"
        referenceDate={referenceDate}
        value={null}
        onValueChange={vi.fn()}
      />
      <button type="submit">Save optional date</button>
    </form>,
  );
  await user.click(screen.getByRole('button', { name: 'Save optional date' }));
  expect(submit).toHaveBeenCalledOnce();
  screen.getByRole('spinbutton', { name: /month, Optional date/i }).focus();
  await user.keyboard('2');
  await user.click(screen.getByRole('button', { name: 'Save optional date' }));
  expect(submit).toHaveBeenCalledOnce();
  expect(screen.getByRole('spinbutton', { name: /day, Optional date/i })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Clear Optional date' }));
  await user.click(screen.getByRole('button', { name: 'Save optional date' }));
  expect(submit).toHaveBeenCalledTimes(2);
});

it('rejects out-of-bounds edits and clears feedback after valid requests', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedInputDate
      label="Bounded date"
      referenceDate={referenceDate}
      value="2024-02-29"
      min="2024-01-01"
      max="2024-02-29"
      onValueChange={change}
    />,
  );
  screen.getByRole('spinbutton', { name: /month, Bounded date/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByText('Date must be within its allowed limits.')).toBeVisible();
  await user.keyboard('{ArrowDown}');
  expect(change).toHaveBeenLastCalledWith('2024-01-29');
  expect(screen.queryByText('Date must be within its allowed limits.')).toBeNull();
});

it('resets canonical dates to the initially empty native form value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <form>
        <SharedInputDate
          label="Reset date"
          referenceDate={referenceDate}
          value={value}
          name="date"
          onValueChange={(next) => {
            setValue(next);
            change(next);
          }}
        />
        <button type="button" onClick={() => setValue('2024-02-29')}>
          Fill date
        </button>
        <button type="reset">Reset dates</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Fill date' }));
  await user.click(screen.getByRole('button', { name: 'Reset dates' }));
  expect(change).toHaveBeenLastCalledWith(null);
});
