import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiCalendar } from './calendar.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { FormPendingContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

it('preserves canonical pending data and excludes disabled/inactive names', () => {
  const change = vi.fn();
  const calendar = <MuiCalendar label="Delivery" name="delivery" value="2026-11-16"
    referenceDate="2026-11-01" onValueChange={change} />;
  const view = render(<form aria-label="Order"><FormPendingContext value={true}>
    {calendar}
  </FormPendingContext></form>);
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
  expect(new FormData(form).get('delivery')).toBe('2026-11-16');
  fireEvent.click(screen.getByRole('gridcell', { name: '17' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(<form aria-label="Order"><PortalActiveContext value={false}>
    {calendar}
  </PortalActiveContext></form>);
  expect(new FormData(form).has('delivery')).toBe(false);
  view.rerender(<form aria-label="Order"><MuiCalendar label="Delivery" disabled
    name="delivery" value={null} referenceDate="2026-11-01"
    onValueChange={change} /></form>);
  expect(new FormData(form).has('delivery')).toBe(false);
});

it('uses reference today, native limits, locale and month navigation', async () => {
  const change = vi.fn();
  render(<MuiCalendar label="Delivery" value={null} referenceDate="2026-11-16"
    locale="en-GB" weekStartsOn={0} min="2026-11-10" max="2026-12-20"
    onValueChange={change} />);
  expect(screen.getByRole('gridcell', { name: '9' })).toBeDisabled();
  expect(screen.getAllByRole('columnheader')[0])
    .toHaveAttribute('aria-label', 'Sunday');
  expect(screen.getByRole('gridcell', { name: '16' }).className)
    .toContain('MuiPickerDay-today');
  await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
  expect(screen.getByText('December 2026')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
  expect(screen.getByText('November 2026')).toBeVisible();
});

it('validates required readonly canonical values through the native form scope', () => {
  const save = vi.fn();
  const view = render(<MuiForm label="Order" onSubmit={save}>
    <MuiCalendar label="Delivery" required readOnly value={null}
      referenceDate="2026-11-01" onValueChange={vi.fn()} />
    <MuiSubmitButton label="Save" />
  </MuiForm>);
  fireEvent.submit(screen.getByRole('form'));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('group', { name: 'Delivery' })).toHaveFocus();
  view.rerender(<MuiForm label="Order" onSubmit={save}>
    <MuiCalendar label="Delivery" required readOnly value="2026-11-16"
      referenceDate="2026-11-01" onValueChange={vi.fn()} />
    <MuiSubmitButton label="Save" />
  </MuiForm>);
  fireEvent.submit(screen.getByRole('form'));
  expect(save).toHaveBeenCalledWith();
});
