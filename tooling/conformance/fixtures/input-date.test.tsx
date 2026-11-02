import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { ReacdProvider, UnsupportedAdapterComponentError } from '@fastsprout/reacd';
import { InputDateExample } from './input-date.js';

it('preserves dates, range, locale, protection and forms', async () => {
  render(<ReacdProvider adapter={shadcnAdapter}><InputDateExample /></ReacdProvider>);
  screen.getByRole('spinbutton', { name: /day, Event date/i }).focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(screen.getByText('Event date: 2024-02-29')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Save dates' }));
  expect(await screen.findByText('Dates saved.')).toBeVisible();
  for (const label of ['Right to left dates', 'Arabic date locale']) {
    await userEvent.click(screen.getByRole('switch', { name: label }));
    await userEvent.click(screen.getByRole('switch', { name: label }));
  }
  await userEvent.click(screen.getByRole('switch', { name: 'Read-only dates' }));
  expect(screen.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
  await userEvent.click(screen.getByRole('switch', { name: 'Read-only dates' }));
  await userEvent.click(screen.getByRole('switch', { name: 'Disable dates' }));
  expect(screen.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
  await userEvent.click(screen.getByRole('switch', { name: 'Disable dates' }));
  for (const label of ['Booking dates Start', 'Booking dates End', 'Event date'])
    await userEvent.click(screen.getByRole('button', { name: `Clear ${label}` }));
  expect(screen.getByText('Event date: empty')).toBeVisible();
  expect(screen.getByText('Booking dates: empty to empty')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Restore sample dates' }));
  expect(screen.getByText('Event date: 2024-02-28')).toBeVisible();
});

it('restores canonical dates and clears native partial drafts', async () => {
  render(<ReacdProvider adapter={shadcnAdapter}><InputDateExample /></ReacdProvider>);
  const month = screen.getByRole('spinbutton', { name: /month, Event date/i });
  month.focus();
  await userEvent.keyboard('{Backspace}');
  expect(month).not.toHaveAttribute('aria-valuenow');
  expect(screen.getByText('Event date: 2024-02-28')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Restore sample dates' }));
  expect(screen.getByRole('spinbutton', { name: /month, Event date/i }))
    .toHaveAttribute('aria-valuenow', '2');
});

it('isolates Material range while keeping single-date forms native', async () => {
  const errors: unknown[] = [];
  render(<ReacdProvider adapter={muiAdapter}><InputDateExample /></ReacdProvider>, {
    onCaughtError: (error: unknown) => { errors.push(error); },
  });
  expect(screen.getByRole('spinbutton', { name: 'Day' })).toBeVisible();
  expect(screen.getByRole('alert')).toHaveTextContent('Cannot load InputDate range');
  expect(errors[0]).toBeInstanceOf(UnsupportedAdapterComponentError);
  expect(errors[0]).toMatchObject({ adapterId: 'material-ui',
    componentName: 'InputDate' });
  expect(screen.getByRole('button', { name: 'Save dates' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Save dates' }));
  expect(await screen.findByText('Dates saved.')).toBeVisible();
  const form = screen.getByRole('form', { name: 'Dates form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
  expect(Object.fromEntries(new FormData(form))).toEqual({ event: '2024-02-28' });
});
