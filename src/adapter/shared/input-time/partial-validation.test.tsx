import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { SharedInputTime } from './input-time.adapter.js';

it('blocks required submission after clearing a committed segment', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <SharedInputTime
        label="Existing time"
        value="00:30:00"
        onValueChange={vi.fn()}
        required
        name="time"
      />
      <button type="submit">Save existing time</button>
    </form>,
  );
  const hour = screen.getByRole('spinbutton', { name: /hour, Existing time/i });
  hour.focus();
  await user.keyboard('{Backspace}');
  expect(hour).not.toHaveAttribute('aria-valuenow');
  await user.click(screen.getByRole('button', { name: 'Save existing time' }));
  expect(submit).not.toHaveBeenCalled();
  expect(hour).toHaveFocus();
  expect(
    screen.getByText('Complete all time segments or clear the field.'),
  ).toBeInTheDocument();
  expect(hour).toHaveAccessibleDescription(/Complete all time segments/);
  await user.keyboard('0');
  await user.click(screen.getByRole('button', { name: 'Save existing time' }));
  expect(submit).toHaveBeenCalledOnce();
});

it('allows an optional empty field but blocks its nonempty partial draft', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <SharedInputTime label="Optional time" value={null} onValueChange={vi.fn()} />
      <button type="submit">Save optional time</button>
    </form>,
  );
  await user.click(screen.getByRole('button', { name: 'Save optional time' }));
  expect(submit).toHaveBeenCalledOnce();
  const hour = screen.getByRole('spinbutton', { name: /hour, Optional time/i });
  hour.focus();
  await user.keyboard('12');
  await user.click(screen.getByRole('button', { name: 'Save optional time' }));
  expect(submit).toHaveBeenCalledOnce();
  expect(
    screen.getByRole('spinbutton', { name: /minute, Optional time/i }),
  ).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Clear Optional time' }));
  await user.click(screen.getByRole('button', { name: 'Save optional time' }));
  expect(submit).toHaveBeenCalledTimes(2);
});

it('does not let a committed range endpoint mask its incomplete draft', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <SharedInputTime
        label="Existing range"
        mode="range"
        required
        value={{ start: '00:30:00', end: '00:30:00' }}
        onValueChange={vi.fn()}
      />
      <button type="submit">Save existing range</button>
    </form>,
  );
  const hour = screen.getByRole('spinbutton', { name: /hour, End Existing range/i });
  hour.focus();
  await user.keyboard('{Backspace}');
  await user.click(screen.getByRole('button', { name: 'Save existing range' }));
  expect(submit).not.toHaveBeenCalled();
  expect(hour).toHaveFocus();
});

it('restores a declined clear before optional native submission', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const submit = vi.fn();
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <SharedInputTime
        label="Declined clear"
        value="00:00:00"
        name="time"
        onValueChange={change}
      />
      <button type="submit">Save declined clear</button>
    </form>,
  );
  for (const unit of ['hour', 'minute', 'second']) {
    const segment = screen.getByRole('spinbutton', { name: `${unit}, Declined clear` });
    segment.focus();
    await user.keyboard('{Backspace}');
  }
  expect(change).toHaveBeenLastCalledWith(null);
  for (const unit of ['hour', 'minute', 'second']) {
    expect(
      screen.getByRole('spinbutton', { name: `${unit}, Declined clear` }),
    ).toHaveAttribute('aria-valuenow', '0');
  }
  await user.click(screen.getByRole('button', { name: 'Save declined clear' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith({ time: '00:00:00' });
});

it('submits an empty optional draft after the host accepts clearing', async () => {
  const user = userEvent.setup();
  const submit = vi.fn((event: FormEvent) => event.preventDefault());
  function Example() {
    const [value, setValue] = useState<string | null>('00:00:00');
    return (
      <form onSubmit={submit}>
        <SharedInputTime
          label="Accepted clear"
          value={value}
          name="time"
          onValueChange={setValue}
        />
        <button type="submit">Save accepted clear</button>
      </form>
    );
  }
  render(<Example />);
  for (const unit of ['hour', 'minute', 'second']) {
    const segment = screen.getByRole('spinbutton', { name: `${unit}, Accepted clear` });
    segment.focus();
    await user.keyboard('{Backspace}');
  }
  await user.click(screen.getByRole('button', { name: 'Save accepted clear' }));
  expect(submit).toHaveBeenCalledOnce();
});
