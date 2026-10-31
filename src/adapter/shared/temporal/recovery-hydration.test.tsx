import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from '../../../../test-support/shared-adapter-server.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedInputDate } from '../input-date/input-date.adapter.js';
import { SharedInputTime } from '../input-time/input-time.adapter.js';

for (const kind of ['date', 'time']) {
  it(`${kind} hydrates isolated native range reset ownership`, async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();
    const errors: unknown[] = [];
    const value =
      kind === 'date'
        ? { start: '2024-01-01', end: '2024-01-05' }
        : { start: '09:00:00', end: '10:00:00' };
    function Field({ onValueChange = first }) {
      const properties = {
        mode: 'range' as const,
        label: 'Hydrated',
        value,
        onValueChange,
      };
      return kind === 'date' ? (
        <SharedInputDate {...properties} referenceDate="2024-01-01" />
      ) : (
        <SharedInputTime {...properties} />
      );
    }
    const ui = (
      <>
        <form>
          <Field />
          <button type="reset">Reset first</button>
        </form>
        <form>
          <Field onValueChange={second} />
          <button type="reset">Reset second</button>
        </form>
      </>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    const ids = [...container.querySelectorAll('[role="spinbutton"]')].map(
      (element) => element.id,
    );
    const view = render(ui, {
      hydrate: true,
      container,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(
      [...container.querySelectorAll('[role="spinbutton"]')].map(
        (element) => element.id,
      ),
    ).toEqual(ids);
    await user.click(screen.getByRole('button', { name: 'Reset first' }));
    expect(first).toHaveBeenCalledExactlyOnceWith(value);
    expect(Object.isFrozen(first.mock.calls[0]?.[0])).toBe(true);
    expect(second).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  });
}
