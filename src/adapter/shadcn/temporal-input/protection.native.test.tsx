import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnInputTime } from '../input-time/input-time.adapter.js';

it('keeps readonly segments and disabled form participation', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <form>
      <ShadcnInputTime
        label="Time"
        value="12:30:00"
        readOnly
        name="time"
        description="Local time"
        onValueChange={change}
      />
    </form>,
  );
  const hour = screen.getByRole('spinbutton', { name: /hour/i });
  await user.click(hour);
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Clear Time' })).toBeDisabled();
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([['time', '12:30:00']]);
  view.rerender(
    <form>
      <ShadcnInputTime
        label="Time"
        value="12:30:00"
        disabled
        name="time"
        onValueChange={change}
      />
    </form>,
  );
  expect([...new FormData(form)]).toEqual([]);
});

it('renders empty ranges and explicit numeric locale direction', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  function EmptyDates() {
    const [value, setValue] = useState<{
      start: string | null;
      end: string | null;
    }>({ start: null, end: null });
    return (
      <DirectionProvider dir="rtl">
        <ShadcnInputDate
          label="Dates"
          referenceDate="2024-02-28"
          mode="range"
          locale="en-US"
          value={value}
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
      </DirectionProvider>
    );
  }
  const view = render(<EmptyDates />);
  const start = screen.getByRole('group', { name: 'Dates Start' });
  expect(start).toHaveAttribute('dir', 'ltr');
  await user.click(within(start).getByRole('spinbutton', { name: /month/i }));
  await user.keyboard('2');
  await user.click(within(start).getByRole('spinbutton', { name: /day/i }));
  await user.keyboard('28');
  await user.click(within(start).getByRole('spinbutton', { name: /year/i }));
  await user.keyboard('2024');
  expect(change).toHaveBeenLastCalledWith({ start: '2024-02-28', end: null });
  view.rerender(
    <ShadcnInputTime
      label="Times"
      mode="range"
      value={{ start: null, end: null }}
      onValueChange={change}
      locale="ar-SA"
    />,
  );
  expect(screen.getAllByRole('spinbutton').length).toBe(6);
});

it('rejects invalid bounded requests through native SDK validation', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnInputDate
      label="Date"
      referenceDate="2024-02-28"
      value="2024-02-28"
      min="2024-02-28"
      max="2024-02-29"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('spinbutton', { name: /day/i }));
  await user.keyboard('27');
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnInputTime
      label="Time"
      value="12:30:00"
      min="12:00:00"
      max="13:00:00"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('spinbutton', { name: /hour/i }));
  await user.keyboard('14');
  expect(change).not.toHaveBeenCalled();
});
