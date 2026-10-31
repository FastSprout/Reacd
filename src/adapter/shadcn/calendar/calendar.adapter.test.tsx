import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { App, ReacdProvider } from '../../../index.js';
import type { CalendarProps } from '../../../components/calendar/index.js';
import { ShadcnCalendar } from './calendar.adapter.js';

const BASE = { label: 'Delivery date', referenceDate: '2026-10-29' };
const day = (number: number) =>
  screen.getByRole('button', { name: new RegExp(`October ${number}, 2026$`) });

function Example(
  properties: Pick<CalendarProps, 'locale'> & { value?: string | null },
) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <ShadcnCalendar {...BASE} value={value} onValueChange={setValue} {...properties} />
  );
}

it('requests single selection, clearing and keyboard navigation', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar {...BASE} value={null} onValueChange={change} />
    </ReacdProvider>,
  );
  await user.click(day(29));
  expect(change).toHaveBeenLastCalledWith('2026-10-29');
  expect(day(29).closest('[role="gridcell"]')).not.toHaveAttribute('aria-selected');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar {...BASE} value="2026-10-29" onValueChange={change} />
    </ReacdProvider>,
  );
  await user.click(day(29));
  expect(change).toHaveBeenLastCalledWith(null);
  await user.click(screen.getByRole('button', { name: 'Next month' }));
  expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Previous month' }));
  await user.click(day(29));
  await user.keyboard('{ArrowRight}');
  expect(day(30)).toHaveFocus();
  await user.keyboard('{Home}');
  expect(day(26)).toHaveFocus();
});

it('protects disabled, readonly, required and bounded selection', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar
        {...BASE}
        value="2026-10-29"
        onValueChange={change}
        min="2026-10-28"
        max="2026-10-30"
        required
      />
    </ReacdProvider>,
  );
  expect(day(27)).toBeDisabled();
  expect(day(31)).toBeDisabled();
  await user.click(day(29));
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar {...BASE} value={null} onValueChange={change} readOnly />
    </ReacdProvider>,
  );
  await user.click(day(29));
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Next month' }));
  expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar {...BASE} value={null} onValueChange={change} disabled />
    </ReacdProvider>,
  );
  const next = screen.getByRole('button', { name: 'Next month' });
  expect(next).toHaveAttribute('aria-disabled', 'true');
  await user.click(next);
  expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  expect(
    screen
      .getAllByRole('button')
      .every(
        (button) =>
          button.hasAttribute('disabled') ||
          button.getAttribute('aria-disabled') === 'true',
      ),
  ).toBe(true);
});

it('creates and completes ordered partial ranges', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar
        {...BASE}
        mode="range"
        value={{ start: null, end: null }}
        onValueChange={change}
      />
    </ReacdProvider>,
  );
  await user.click(day(29));
  expect(change).toHaveBeenLastCalledWith({ start: '2026-10-29', end: null });
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnCalendar
        {...BASE}
        mode="range"
        value={{ start: '2026-10-29', end: null }}
        onValueChange={change}
      />
    </ReacdProvider>,
  );
  await user.click(day(28));
  expect(change).toHaveBeenLastCalledWith({ start: '2026-10-28', end: '2026-10-29' });
});

it('formats Gregorian locale and follows App RTL keys', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <App direction="rtl">
        <Example value="2026-10-29" />
      </App>
    </ReacdProvider>,
  );
  await user.click(day(29));
  await user.keyboard('{ArrowLeft}');
  expect(day(30)).toHaveFocus();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Example value="2026-10-29" locale="pl-PL" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('grid', { name: 'październik 2026' })).toBeInTheDocument();
});

it('serializes form values and redirects invalid required focus', () => {
  const view = render(
    <form aria-label="Delivery form">
      <ReacdProvider adapter={shadcnAdapter}>
        <ShadcnCalendar
          {...BASE}
          value={null}
          onValueChange={() => undefined}
          description="Select the delivery day."
          required
          name="delivery"
        />
      </ReacdProvider>
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Delivery form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form.');
  expect(form.checkValidity()).toBe(false);
  expect(screen.getByRole('group', { name: 'Delivery date' })).toHaveFocus();
  expect(new FormData(form).get('delivery')).toBe('');
  view.rerender(
    <form aria-label="Delivery form">
      <ReacdProvider adapter={shadcnAdapter}>
        <ShadcnCalendar
          {...BASE}
          mode="range"
          value={{ start: '2026-10-29', end: '2026-10-30' }}
          onValueChange={() => undefined}
          name="delivery"
          required
        />
      </ReacdProvider>
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).get('delivery.start')).toBe('2026-10-29');
  expect(new FormData(form).get('delivery.end')).toBe('2026-10-30');
  fireEvent.invalid(form.querySelector('.reacd-calendar-validation') ?? form);
  expect(screen.getByRole('group', { name: 'Delivery date' })).toHaveFocus();
});

it('requires both range endpoints and omits disabled submitted values', () => {
  const change = () => undefined;
  const view = render(
    <form aria-label="Range form">
      <ShadcnCalendar
        {...BASE}
        mode="range"
        value={{ start: '2026-10-29', end: null }}
        onValueChange={change}
        required
        name="delivery"
      />
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Range form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing range form.');
  expect(form.checkValidity()).toBe(false);
  expect(new FormData(form).get('delivery.start')).toBe('2026-10-29');
  expect(new FormData(form).get('delivery.end')).toBe('');
  view.rerender(
    <form aria-label="Range form">
      <ShadcnCalendar
        {...BASE}
        mode="range"
        value={{ start: null, end: '2026-10-30' }}
        onValueChange={change}
        required
        name="delivery"
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(false);
  expect(new FormData(form).get('delivery.end')).toBe('2026-10-30');
  view.rerender(
    <form aria-label="Range form">
      <ShadcnCalendar
        {...BASE}
        mode="range"
        value={{ start: '2026-10-29', end: '2026-10-30' }}
        onValueChange={change}
        required
        name="delivery"
        disabled
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form).entries())).toEqual([]);
});
