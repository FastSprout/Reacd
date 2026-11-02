import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnCalendar } from './calendar.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';

it('uses official day buttons and requests canonical single values', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnCalendar
      label="Delivery"
      referenceDate="2026-11-01"
      value={null}
      onValueChange={change}
    />,
  );
  const day = screen.getByRole('button', { name: /November 5, 2026/ });
  expect(day.className).toContain('data-[selected-single=true]:bg-primary');
  await user.click(day);
  expect(change).toHaveBeenCalledExactlyOnceWith('2026-11-05');
  expect(day).not.toHaveAttribute('data-selected-single', 'true');
  view.rerender(
    <ShadcnCalendar
      label="Delivery"
      referenceDate="2026-11-01"
      value="2026-11-05"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('button', { name: /November 5, 2026/ }));
  expect(change).toHaveBeenLastCalledWith(null);
});

it('validates required selection and focuses a real keyboard day', async () => {
  const submit = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnForm label="Delivery form" onSubmit={submit}>
      <ShadcnCalendar
        label="Delivery"
        referenceDate="2026-11-01"
        value={null}
        onValueChange={vi.fn()}
        name="delivery"
        required
      />
      <button type="submit">Save</button>
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Select a date.'),
  );
  expect(submit).not.toHaveBeenCalled();
  const focused = document.activeElement;
  expect(focused).toHaveAttribute('data-day');
  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).not.toBe(focused);
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Expected form');
  expect([...new FormData(form)]).toEqual([['delivery', '']]);
});

it('delegates partial/equal/restart range behavior to the native SDK', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnCalendar
      label="Window"
      referenceDate="2026-11-01"
      mode="range"
      value={{ start: null, end: '2026-11-05' }}
      onValueChange={change}
    />,
  );
  const day = screen.getByRole('button', { name: /November 5, 2026/ });
  await user.click(day);
  expect(change).toHaveBeenLastCalledWith({
    start: '2026-11-05',
    end: '2026-11-05',
  });
  view.rerender(
    <ShadcnCalendar
      label="Window"
      referenceDate="2026-11-01"
      mode="range"
      value={{ start: '2026-11-05', end: '2026-11-05' }}
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('button', { name: /November 5, 2026/ }));
  expect(change).toHaveBeenLastCalledWith({ start: '2026-11-05', end: null });
});
