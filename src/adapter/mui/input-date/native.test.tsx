import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputDate } from './input-date.adapter.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';

it('uses native segmented editing and canonical successful form data', async () => {
  const change = vi.fn();
  const view = render(
    <form aria-label="Order">
      <MuiInputDate label="Delivery" value="2026-11-16" name="date"
        referenceDate="2026-11-01" locale="de-DE" onValueChange={change} />
    </form>,
  );
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
  expect(new FormData(form).get('date')).toBe('2026-11-16');
  expect(screen.getAllByRole('spinbutton')).toHaveLength(3);
  await userEvent.click(screen.getByRole('button', { name: 'Clear Delivery' }));
  expect(change).toHaveBeenLastCalledWith(null);
  view.rerender(<MuiInputDate label="Delivery" value={null}
    referenceDate="2026-11-01" onValueChange={change} />);
});

it('rejects range through the exact documented exception', () => {
  expect(() => render(<MuiInputDate label="Period" mode="range"
    value={{ start: null, end: null }} referenceDate="2026-11-01"
    onValueChange={vi.fn()} />)).toThrow(
      new UnsupportedAdapterComponentError('material-ui', 'InputDate'),
    );
});
