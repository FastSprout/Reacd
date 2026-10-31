import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { TemporalRange } from '../../../core/date-time.js';
import { SharedInputDate } from '../input-date/input-date.adapter.js';
import { SharedInputTime } from '../input-time/input-time.adapter.js';

for (const kind of ['date', 'time'] as const) {
  const initial =
    kind === 'date'
      ? { start: '2024-01-01', end: '2024-01-05' }
      : { start: '09:00:00', end: '10:00:00' };
  const replacement =
    kind === 'date'
      ? { start: '2024-02-01', end: '2024-02-05' }
      : { start: '13:00:00', end: '14:00:00' };

  for (const protection of [{}, { readOnly: true }, { disabled: true }]) {
    it(`${kind} retains host authority on declined/protected reset ${JSON.stringify(
      protection,
    )}`, async () => {
      const user = userEvent.setup();
      const change = vi.fn();
      function Example() {
        const [value, setValue] = useState<TemporalRange>(initial);
        const properties = {
          ...protection,
          mode: 'range' as const,
          label: 'Range',
          value,
          name: 'range',
          onValueChange: change,
        };
        return (
          <form>
            {kind === 'date' ? (
              <SharedInputDate {...properties} referenceDate="2024-01-01" />
            ) : (
              <SharedInputTime {...properties} />
            )}
            <button type="button" onClick={() => setValue(replacement)}>
              Replace
            </button>
            <button type="reset">Reset</button>
          </form>
        );
      }
      const view = render(<Example />);
      await user.click(screen.getByRole('button', { name: 'Replace' }));
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      if (Object.keys(protection).length === 0) {
        expect(change).toHaveBeenCalledExactlyOnceWith(initial);
      } else {
        expect(change).not.toHaveBeenCalled();
      }
      const form = view.container.querySelector('form');
      if (form === null) throw new Error('Expected native form.');
      expect(Object.fromEntries(new FormData(form))).toEqual(
        'disabled' in protection
          ? {}
          : {
              'range.start': replacement.start,
              'range.end': replacement.end,
            },
      );
      expect(view.container.querySelectorAll('[data-placeholder]')).toHaveLength(0);
    });
  }

  it(`${kind} validates native reset against current bounds`, async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<TemporalRange>(initial);
      const [min, setMin] = useState<string>();
      const properties = {
        mode: 'range' as const,
        label: 'Limited',
        value,
        min,
        onValueChange: change,
      };
      return (
        <form>
          {kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2024-01-01" />
          ) : (
            <SharedInputTime {...properties} />
          )}
          <button
            type="button"
            onClick={() => {
              setValue(replacement);
              setMin(replacement.start);
            }}
          >
            Limit
          </button>
          <button type="reset">Reset</button>
        </form>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Limit' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getAllByText(/range must be ordered and within/)).toHaveLength(2);
  });

  it(`${kind} preserves incomplete drafts on same-value rerenders`, async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<TemporalRange>(initial);
      const properties = {
        mode: 'range' as const,
        label: 'Draft',
        value,
        onValueChange: () => undefined,
      };
      return (
        <>
          {kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2024-01-01" />
          ) : (
            <SharedInputTime {...properties} />
          )}
          <button onClick={() => setValue({ end: value.end, start: value.start })}>
            Refresh
          </button>
        </>
      );
    }
    render(<Example />);
    const missing = screen.getByRole('spinbutton', {
      name: new RegExp(`${kind === 'date' ? 'month' : 'hour'}, Start Draft`, 'i'),
    });
    missing.focus();
    await user.keyboard('{Backspace}');
    expect(missing).not.toHaveAttribute('aria-valuenow');
    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(missing).not.toHaveAttribute('aria-valuenow');
  });
}
