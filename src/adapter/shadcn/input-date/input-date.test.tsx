import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { expect, it, vi } from 'vitest';
import { ShadcnInputDate } from './input-date.adapter.js';

const referenceDate = '2024-02-28';

it('edits leap dates, respects the host and clears values', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <ShadcnInputDate
      label="Event"
      referenceDate={referenceDate}
      value="2024-02-28"
      onValueChange={change}
      description="Gregorian event date"
    />,
  );
  const day = screen.getByRole('spinbutton', { name: /day, Event/i });
  expect(
    screen.getByRole('spinbutton', { name: /month, Event/i }),
  ).toHaveAccessibleDescription(/Gregorian event date/);
  day.focus();
  await user.keyboard('{ArrowUp}');
  expect(change).toHaveBeenLastCalledWith('2024-02-29');
  expect(day).toHaveAttribute('aria-valuenow', '28');
  rerender(
    <ShadcnInputDate
      label="Event"
      referenceDate={referenceDate}
      value="2024-02-29"
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('spinbutton', { name: /day, Event/i })).toHaveAttribute(
    'aria-valuenow',
    '29',
  );
  await user.click(screen.getByRole('button', { name: 'Clear Event' }));
  expect(change).toHaveBeenLastCalledWith(null);
  rerender(
    <ShadcnInputDate
      label="Event"
      referenceDate={referenceDate}
      value={null}
      onValueChange={change}
    />,
  );
  expect(day).not.toHaveAttribute('aria-valuenow');
  await user.click(screen.getByRole('button', { name: 'Clear Event' }));
  expect(change).toHaveBeenLastCalledWith(null);
});

it('guards ordered range endpoints and inclusive limits', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState<
      Readonly<{
        start: string | null;
        end: string | null;
      }>
    >({ start: '2024-02-28', end: '2024-02-28' });
    return (
      <ShadcnInputDate
        label="Booking"
        referenceDate={referenceDate}
        mode="range"
        value={value}
        name="booking"
        min="2024-02-01"
        max="2024-03-01"
        onValueChange={(next) => {
          setValue(next);
          change(next);
        }}
      />
    );
  }
  render(<Example />);
  screen.getByRole('spinbutton', { name: /day, Start Booking/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  expect(
    screen.getAllByText('Date range must be ordered and within its allowed limits.'),
  ).toHaveLength(2);
  await user.click(screen.getByRole('button', { name: 'Clear End Booking' }));
  expect(change).toHaveBeenLastCalledWith({ start: '2024-02-28', end: null });
  await user.click(screen.getByRole('button', { name: 'Clear Start Booking' }));
  expect(change).toHaveBeenLastCalledWith({ start: null, end: null });
});

it.each([{ disabled: true }, { readOnly: true }])(
  'protects date editing: %j',
  async (protection) => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ShadcnInputDate
        {...protection}
        label="Protected"
        referenceDate={referenceDate}
        value="2024-02-29"
        onValueChange={change}
      />,
    );
    screen.getByRole('spinbutton', { name: /day, Protected/i }).focus();
    await user.keyboard('{ArrowUp}');
    await user.click(screen.getByRole('button', { name: 'Clear Protected' }));
    expect(change).not.toHaveBeenCalled();
  },
);

it('keeps Gregorian years with locale and App directions', () => {
  const { container, rerender } = render(
    <DirectionProvider dir="rtl">
      <ShadcnInputDate
        label="Locale date"
        locale="ja-JP-u-ca-japanese"
        referenceDate={referenceDate}
        value="2024-02-29"
        onValueChange={vi.fn()}
      />
    </DirectionProvider>,
  );
  expect(container.querySelector('.reacd-input-date')).toHaveAttribute('dir', 'rtl');
  expect(screen.getByRole('group', { name: 'Locale date' })).toBeInTheDocument();
  expect(container.querySelector('[data-type="year"]')).toHaveAttribute(
    'aria-valuenow',
    '2024',
  );
  expect(container.querySelector('.reacd-date-segments')).toHaveAttribute('dir', 'ltr');
  rerender(
    <DirectionProvider dir="rtl">
      <ShadcnInputDate
        label="Locale date"
        locale="ar-EG"
        referenceDate={referenceDate}
        value="2024-02-29"
        onValueChange={vi.fn()}
      />
    </DirectionProvider>,
  );
  expect(container.querySelector('.reacd-date-segments')).toHaveAttribute('dir', 'rtl');
});

it('fills empty segments from the explicit host reference', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ShadcnInputDate
      label="Reference date"
      referenceDate="2042-06-15"
      value={null}
      onValueChange={change}
    />,
  );
  const year = screen.getByRole('spinbutton', { name: /year, Reference date/i });
  year.focus();
  await user.keyboard('{ArrowUp}');
  expect(year).toHaveAttribute('aria-valuenow', '2042');
  expect(change).not.toHaveBeenCalled();
  screen.getByRole('spinbutton', { name: /month, Reference date/i }).focus();
  await user.keyboard('{ArrowUp}');
  screen.getByRole('spinbutton', { name: /day, Reference date/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(change).toHaveBeenLastCalledWith('2042-06-15');
});
