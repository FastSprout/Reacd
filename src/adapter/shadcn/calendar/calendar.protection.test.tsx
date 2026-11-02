import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DirectionProvider } from '@radix-ui/react-direction';
import { expect, it, vi } from 'vitest';
import { ShadcnCalendar } from './calendar.adapter.js';

it('keeps readonly navigation and blocks selection in both modes', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnCalendar
      label="Day"
      referenceDate="2026-11-01"
      value="2026-11-05"
      readOnly
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('button', { name: /November 5, 2026/ }));
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Next month' }));
  expect(screen.getByText('December 2026')).toBeVisible();
  view.rerender(
    <ShadcnCalendar
      label="Day"
      referenceDate="2026-11-01"
      mode="range"
      value={{ start: null, end: null }}
      readOnly
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('button', { name: /December 5, 2026/ }));
  expect(change).not.toHaveBeenCalled();
});

it('clamps months, protects limits and inherits direction', async () => {
  const change = vi.fn();
  const view = render(
    <DirectionProvider dir="rtl">
      <ShadcnCalendar
        label="Day"
        referenceDate="2026-01-01"
        value={null}
        min="2026-11-05"
        max="2026-11-20"
        numberOfMonths={2}
        weekStartsOn={0}
        locale="en-GB"
        onValueChange={change}
      />
    </DirectionProvider>,
  );
  expect(screen.getAllByRole('grid')[0]?.closest('[dir]')).toHaveAttribute(
    'dir',
    'rtl',
  );
  for (const day of screen.getAllByRole('button', { name: /, 4 November 2026$/ })) {
    expect(day).toBeDisabled();
  }
  view.rerender(
    <ShadcnCalendar
      label="Day"
      referenceDate="2026-12-31"
      value={null}
      min="2026-11-05"
      max="2026-11-20"
      disabled
      name="day"
      onValueChange={change}
    />,
  );
  expect(screen.getByText('November 2026')).toBeVisible();
  const next = screen.getByRole('button', { name: 'Next month' });
  expect(next).toHaveAttribute('aria-disabled', 'true');
  await userEvent.click(next);
  expect(screen.getByText('November 2026')).toBeVisible();
  expect(screen.getByRole('button', { name: /November 5, 2026/ })).toBeDisabled();
});
