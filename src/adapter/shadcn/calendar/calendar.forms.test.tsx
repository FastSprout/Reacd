import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnCalendar } from './calendar.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

it('serializes ranges and validates both endpoints with native focus', async () => {
  const change = vi.fn();
  const submit = vi.fn();
  const user = userEvent.setup();
  function View({ end }: { end: string | null }) {
    return (
      <ShadcnForm label="Window form" onSubmit={submit}>
        <ShadcnCalendar
          label="Window"
          referenceDate="2026-11-01"
          mode="range"
          value={{ start: '2026-11-05', end }}
          name="window"
          required
          description="Dispatch window"
          onValueChange={change}
        />
        <button type="submit">Save</button>
      </ShadcnForm>
    );
  }
  const view = render(<View end={null} />);
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Select a complete date range.',
    ),
  );
  expect(submit).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /November 6, 2026/ }));
  expect(change).toHaveBeenLastCalledWith({ start: '2026-11-05', end: '2026-11-06' });
  view.rerender(<View end="2026-11-06" />);
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([
    ['window.start', '2026-11-05'],
    ['window.end', '2026-11-06'],
  ]);
});

it('preserves optional unnamed values and host errors through RHF', async () => {
  const submit = vi.fn();
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnFormField name="review" error="Host rejection">
        <ShadcnCalendar
          label="Day"
          referenceDate="2026-11-01"
          value={null}
          onValueChange={change}
        />
      </ShadcnFormField>
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(document.activeElement).toHaveAttribute('data-day'));
  expect(submit).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /November 6, 2026/ }));
  expect(change).toHaveBeenCalledExactlyOnceWith('2026-11-06');
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([['review', '']]);
  view.rerender(
    <ShadcnForm label="Form" onSubmit={submit}>
      <ShadcnCalendar
        label="Day"
        referenceDate="2026-11-01"
        value={null}
        onValueChange={change}
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
});

it('keeps empty native range names and omits disabled range fields', () => {
  const props = {
    label: 'Empty window',
    referenceDate: '2026-11-01',
    name: 'window',
    value: { start: null, end: null },
    onValueChange: vi.fn(),
  };
  const view = render(
    <form>
      <ShadcnCalendar {...props} mode="range" />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([
    ['window.start', ''],
    ['window.end', ''],
  ]);
  view.rerender(
    <form>
      <ShadcnCalendar {...props} mode="range" disabled />
    </form>,
  );
  expect([...new FormData(form)]).toEqual([]);
});
