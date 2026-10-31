import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedFormField } from '../form-field/form-field.adapter.js';
import { SharedInputDate } from '../input-date/input-date.adapter.js';
import { SharedInputTime } from '../input-time/input-time.adapter.js';

for (const kind of ['date', 'time'] as const) {
  const value =
    kind === 'date'
      ? { start: '2026-10-14', end: '2026-10-20' }
      : { start: '12:30:00', end: '14:00:00' };

  it(`${kind} range reset respects inherited disabled protection`, async () => {
    const change = vi.fn();
    const properties = {
      mode: 'range' as const,
      label: 'Protected range',
      value,
      disabled: false,
      onValueChange: change,
    };
    const { container } = render(
      <form>
        <SharedFormField name="range" disabled>
          {kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2026-10-14" />
          ) : (
            <SharedInputTime {...properties} />
          )}
        </SharedFormField>
      </form>,
    );
    const form = container.querySelector('form');
    if (!form) throw new Error('Expected a native form.');
    await act(async () => {
      fireEvent.reset(form);
    });
    expect(change).not.toHaveBeenCalled();
    expect([...new FormData(form)]).toEqual([]);
    for (const segment of screen.getAllByRole('spinbutton')) {
      expect(segment).toHaveAttribute('aria-disabled', 'true');
      expect(segment).not.toHaveAttribute('contenteditable', 'true');
    }
  });

  it(`${kind} required defaults and overrides govern draft validity`, () => {
    const change = vi.fn();
    function Example({ required }: { readonly required?: boolean }) {
      const properties = { label: 'Empty field', value: null, onValueChange: change };
      return (
        <form>
          <SharedFormField name="value" required>
            {kind === 'date' ? (
              <SharedInputDate
                {...properties}
                required={required}
                referenceDate="2026-10-14"
              />
            ) : (
              <SharedInputTime {...properties} required={required} />
            )}
          </SharedFormField>
        </form>
      );
    }
    const { container, rerender } = render(<Example />);
    const form = container.querySelector('form');
    if (!form) throw new Error('Expected a native form.');
    act(() => {
      expect(form.checkValidity()).toBe(false);
    });
    rerender(<Example required={false} />);
    act(() => {
      expect(form.checkValidity()).toBe(true);
    });
    expect(change).not.toHaveBeenCalled();
  });

  it(`${kind} nested metadata preserves outer feedback and inner names`, async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    const properties = {
      label: 'Nested value',
      value: value.start,
      onValueChange: change,
    };
    const { container } = render(
      <SharedFormField name="outer" error="Outer review" description="Outer guide">
        <SharedFormField name="inner" description="Inner guide">
          {kind === 'date' ? (
            <SharedInputDate {...properties} referenceDate="2026-10-14" />
          ) : (
            <SharedInputTime {...properties} />
          )}
        </SharedFormField>
      </SharedFormField>,
    );
    const segment = screen.getAllByRole('spinbutton')[0];
    if (!segment) throw new Error('Expected a segmented control.');
    expect(segment).toHaveAccessibleDescription(/Outer review/);
    expect(segment).toHaveAccessibleDescription(/Outer guide/);
    expect(segment).toHaveAccessibleDescription(/Inner guide/);
    const ids = segment.getAttribute('aria-describedby')?.split(' ');
    expect(new Set(ids).size).toBe(ids?.length);
    expect(container.querySelector('input[name="inner"]')).toHaveValue(value.start);
    segment.focus();
    await user.keyboard('{ArrowUp}');
    expect(change).toHaveBeenCalledOnce();
  });
}
