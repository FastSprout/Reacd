import { useState } from 'react';
import type { FormEvent } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedInputTime } from './input-time.adapter.js';

it('requires range endpoints and submits canonical native values', async () => {
  const user = userEvent.setup();
  const submitted = vi.fn();
  function Example() {
    const [value, setValue] = useState<
      Readonly<{ start: string | null; end: string | null }>
    >({ start: '09:00:00', end: null });
    function submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      submitted(Object.fromEntries(new FormData(event.currentTarget)));
    }
    return (
      <form onSubmit={submit}>
        <SharedInputTime
          label="Shift"
          mode="range"
          name="shift"
          required
          value={value}
          onValueChange={setValue}
        />
        <button type="button" onClick={() => setValue({ start: null, end: null })}>
          Reset shift
        </button>
        <button
          type="button"
          onClick={() => setValue({ start: null, end: '17:00:00' })}
        >
          Keep end
        </button>
        <button
          type="button"
          onClick={() => setValue({ start: '09:00:00', end: '17:30:45' })}
        >
          Fill shift
        </button>
        <button type="submit">Save shift</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Save shift' }));
  expect(submitted).not.toHaveBeenCalled();
  expect(screen.getByRole('spinbutton', { name: /hour, End Shift/i })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Keep end' }));
  await user.click(screen.getByRole('button', { name: 'Save shift' }));
  expect(submitted).not.toHaveBeenCalled();
  expect(screen.getByRole('spinbutton', { name: /hour, Start Shift/i })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Fill shift' }));
  await user.click(screen.getByRole('button', { name: 'Save shift' }));
  expect(submitted).toHaveBeenLastCalledWith({
    'shift.start': '09:00:00',
    'shift.end': '17:30:45',
  });
  await user.click(screen.getByRole('button', { name: 'Reset shift' }));
  await user.click(screen.getByRole('button', { name: 'Save shift' }));
  expect(submitted).toHaveBeenCalledOnce();
});

it('does not commit partial segments and can clear an empty field draft', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<SharedInputTime label="Draft" value={null} onValueChange={change} />);
  const hour = screen.getByRole('spinbutton', { name: /hour, Draft/i });
  hour.focus();
  await user.keyboard('12');
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Clear Draft' }));
  expect(change).toHaveBeenLastCalledWith(null);
  expect(hour).not.toHaveAttribute('aria-valuenow');
});

it('rejects out-of-bounds edits and resets feedback after valid edits', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedInputTime
      label="Bounded"
      value="12:00:00"
      min="11:00:00"
      max="12:00:00"
      onValueChange={change}
    />,
  );
  const hour = screen.getByRole('spinbutton', { name: /hour, Bounded/i });
  hour.focus();
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByText('Time must be within its allowed limits.')).toBeVisible();
  await user.keyboard('{ArrowDown}');
  expect(change).toHaveBeenLastCalledWith('11:00:00');
  expect(screen.queryByText('Time must be within its allowed limits.')).toBeNull();
});

it('resets a filled native form to its initial empty canonical value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <form>
        <SharedInputTime
          label="Reset time"
          name="time"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            change(next);
          }}
        />
        <button type="button" onClick={() => setValue('12:00:00')}>
          Fill time
        </button>
        <button type="reset">Reset time form</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Fill time' }));
  await user.click(screen.getByRole('button', { name: 'Reset time form' }));
  expect(change).toHaveBeenLastCalledWith(null);
});
