import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiCalendar } from './calendar.adapter.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';

it('selects canonical dates through the native DateCalendar', async () => {
  const change = vi.fn();
  const view = render(
    <MuiCalendar label="Delivery" referenceDate="2026-11-01" value={null}
      name="delivery" description="Choose delivery" onValueChange={change} />,
  );
  expect(screen.getByRole('region', { name: 'Delivery' }))
    .toHaveAttribute('tabindex', '0');
  expect(screen.getByText('November 2026')).toBeVisible();
  await userEvent.click(screen.getByRole('gridcell', { name: '16' }));
  expect(change).toHaveBeenLastCalledWith('2026-11-16');
  view.rerender(
    <MuiCalendar label="Delivery" referenceDate="2026-11-01" value="2026-11-16"
      onValueChange={change} readOnly />,
  );
  change.mockClear();
  fireEvent.click(screen.getByRole('gridcell', { name: '17' }));
  expect(change).not.toHaveBeenCalled();
});

it('rejects unsupported range and multiple-month modes by exact identity', () => {
  for (const props of [
    { mode: 'range', value: { start: null, end: null } } as const,
    { numberOfMonths: 2, value: null } as const,
  ]) {
    expect(() => render(<MuiCalendar label="Date" referenceDate="2026-11-01"
      onValueChange={vi.fn()} {...props} />)).toThrow(
      new UnsupportedAdapterComponentError('material-ui', 'Calendar'),
    );
  }
});
