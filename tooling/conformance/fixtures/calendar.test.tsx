import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { ReacdProvider, UnsupportedAdapterComponentError } from '@fastsprout/reacd';
import { CalendarExample } from './calendar.js';

it('preserves native single/range state, forms, direction and protection', async () => {
  render(<ReacdProvider adapter={shadcnAdapter}><CalendarExample /></ReacdProvider>);
  await userEvent.click(
    screen.getByRole('button', { name: 'Save calendar selection' }),
  );
  expect(await screen.findByText('Calendar selection saved.')).toBeVisible();
  await userEvent.click(
    screen.getByRole('button', { name: 'Clear calendar selection' }),
  );
  expect(screen.getByText('Date: empty')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: /October 30, 2026/ }));
  expect(screen.getByText('Date: 2026-10-30')).toBeVisible();
  for (const mode of ['single', 'range']) {
    if (mode === 'range')
      await userEvent.click(
        screen.getByRole('switch', { name: 'Calendar range selection' }),
      );
    await userEvent.click(
      screen.getByRole('switch', { name: 'Show two calendar months' }),
    );
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    await userEvent.click(
      screen.getByRole('switch', { name: 'Show two calendar months' }),
    );
  }
  await userEvent.click(
    screen.getByRole('button', { name: 'Clear calendar selection' }),
  );
  expect(screen.getByText('Range: empty to empty')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: /October 29, 2026/ }));
  expect(screen.getByText('Range: 2026-10-29 to empty')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: /October 30, 2026/ }));
  expect(screen.getByText('Range: 2026-10-29 to 2026-10-30')).toBeVisible();
  await userEvent.click(screen.getByRole('switch', { name: 'Right to left calendar' }));
  await userEvent.click(screen.getByRole('switch', { name: 'Right to left calendar' }));
  await userEvent.click(screen.getByRole('switch', { name: 'Read-only calendar' }));
  expect(screen.getByRole('button', { name: 'Clear calendar selection' }))
    .toBeDisabled();
  await userEvent.click(screen.getByRole('switch', { name: 'Read-only calendar' }));
  await userEvent.click(screen.getByRole('switch', { name: 'Disable calendar' }));
  expect(screen.getByRole('button', { name: /October 29, 2026/ })).toBeDisabled();
});

it('keeps Material single dates usable and isolates unsupported variants', async () => {
  const errors: unknown[] = [];
  render(<ReacdProvider adapter={muiAdapter}><CalendarExample /></ReacdProvider>, {
    onCaughtError: (error: unknown) => { errors.push(error); },
  });
  const form = screen.getByRole('form', { name: 'Calendar form' });
  await userEvent.click(within(form).getByRole('gridcell', { name: '30' }));
  expect(screen.getByText('Date: 2026-10-30')).toBeVisible();
  await userEvent.click(
    screen.getByRole('switch', { name: 'Show two calendar months' }),
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Cannot load Calendar variant');
  await userEvent.click(
    screen.getByRole('switch', { name: 'Show two calendar months' }),
  );
  expect(within(form).getByRole('gridcell', { name: '30' }))
    .toHaveAttribute('aria-selected', 'true');
  await userEvent.click(
    screen.getByRole('switch', { name: 'Calendar range selection' }),
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Cannot load Calendar variant');
  for (const error of errors) {
    expect(error).toBeInstanceOf(UnsupportedAdapterComponentError);
    expect(error).toMatchObject({ adapterId: 'material-ui',
      componentName: 'Calendar' });
  }
  expect(errors).toHaveLength(2);
});
