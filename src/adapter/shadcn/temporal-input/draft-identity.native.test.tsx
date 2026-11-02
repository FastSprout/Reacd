import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { TemporalControl } from './control.js';

for (const kind of ['date', 'time'] as const) {
  it(`preserves a focused partial ${kind} draft on a same-value render`, async () => {
    const change = vi.fn();
    const props = kind === 'date'
      ? { kind, referenceDate: '2024-01-15', value: '2024-01-15' }
      : { kind, value: '09:00:00' };
    const view = render(
      <TemporalControl {...props} label="Delivery" onValueChange={change} />,
    );
    const segment = screen.getByRole('spinbutton', {
      name: kind === 'date' ? /month/i : /hour/i,
    });
    segment.focus();
    await userEvent.keyboard('{Backspace}');
    expect(segment).not.toHaveAttribute('aria-valuenow');
    view.rerender(
      <TemporalControl {...props} label="Delivery" onValueChange={change} />,
    );
    expect(segment).toHaveFocus();
    expect(segment).not.toHaveAttribute('aria-valuenow');
    expect(change).not.toHaveBeenCalled();
  });
}
