import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { TemporalRange } from '../../../core/date-time.js';
import { SharedInputDate } from '../input-date/input-date.adapter.js';
import { SharedInputTime } from '../input-time/input-time.adapter.js';

const cases = [
  {
    kind: 'date',
    initial: { start: '2024-01-01', end: '2024-01-05' },
    replacement: { start: '2024-02-01', end: '2024-02-05' },
    bounded: '2024-02-29',
    valid: '2024-01-15',
    segment: 'month',
  },
  {
    kind: 'time',
    initial: { start: '09:00:00', end: '10:00:00' },
    replacement: { start: '13:00:00', end: '14:00:00' },
    bounded: '10:00:00',
    valid: '09:00:00',
    segment: 'hour',
  },
] as const;

for (const sample of cases) {
  it(`${sample.kind} resets atomically without canceling other fields`, async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    function Example() {
      const [value, setValue] = useState<TemporalRange>(sample.initial);
      const properties = {
        mode: 'range' as const,
        label: 'Trip',
        name: 'trip',
        value,
        onValueChange(next: TemporalRange) {
          changed(next);
          setValue(next);
        },
      };
      return (
        <form>
          {sample.kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2024-01-01" />
          ) : (
            <SharedInputTime {...properties} />
          )}
          <input aria-label="Other field" defaultValue="Initial" />
          <button type="button" onClick={() => setValue(sample.replacement)}>
            Replace
          </button>
          <button type="reset">Reset</button>
          <output>{JSON.stringify(value)}</output>
        </form>
      );
    }
    const view = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Replace' }));
    await user.type(screen.getByRole('textbox', { name: 'Other field' }), 'Edited');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(changed).toHaveBeenCalledExactlyOnceWith(sample.initial);
    expect(screen.getByRole('status')).toHaveTextContent(
      JSON.stringify(sample.initial),
    );
    expect(screen.getByRole('textbox', { name: 'Other field' })).toHaveValue('Initial');
    const form = view.container.querySelector('form');
    if (form === null) throw new Error('Expected form.');
    expect(Object.fromEntries(new FormData(form))).toEqual({
      'trip.start': sample.initial.start,
      'trip.end': sample.initial.end,
    });
  });

  it(`${sample.kind} recovers validity after a valid host replacement`, async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<string | null>(sample.bounded);
      const properties = {
        label: 'Event',
        value,
        max: sample.bounded,
        onValueChange(next: string | null) {
          change(next);
          setValue(next);
        },
      };
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {sample.kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2024-02-29" />
          ) : (
            <SharedInputTime {...properties} />
          )}
          <button type="button" onClick={() => setValue(sample.valid)}>
            Replace
          </button>
          <button type="submit">Save</button>
        </form>
      );
    }
    render(<Example />);
    screen
      .getByRole('spinbutton', {
        name: new RegExp(`${sample.segment}, Event`, 'i'),
      })
      .focus();
    await user.keyboard('{ArrowUp}');
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Replace' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
  });

  it(`${sample.kind} recovers limits without committing a candidate`, async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const submit = vi.fn();
    function Example() {
      const [bounded, setBounded] = useState(true);
      const properties = {
        label: 'Limit recovery',
        value: sample.bounded,
        max: bounded ? sample.bounded : undefined,
        onValueChange: change,
      };
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {sample.kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2024-02-29" />
          ) : (
            <SharedInputTime {...properties} />
          )}
          <button type="button" onClick={() => setBounded(false)}>
            Expand
          </button>
          <button type="submit">Save</button>
        </form>
      );
    }
    render(<Example />);
    const segment = screen.getByRole('spinbutton', {
      name: new RegExp(`${sample.segment}, Limit recovery`, 'i'),
    });
    segment.focus();
    await user.keyboard('{ArrowUp}');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
  });
}
