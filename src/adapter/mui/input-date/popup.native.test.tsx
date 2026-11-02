import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputDate } from './input-date.adapter.js';
import { FormPendingContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';

it('uses native popup, reference day, limits and acceptance', async () => {
  const change = vi.fn();
  render(<MuiInputDate label="Delivery" value="2026-11-16"
    referenceDate="2026-11-16" min="2026-11-10" max="2026-12-20"
    onValueChange={change} />);
  await userEvent.click(screen.getByRole('button', { name: /Choose date/ }));
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByRole('gridcell', { name: '9' })).toBeDisabled();
  expect(screen.getByRole('gridcell', { name: '16' }))
    .toHaveAttribute('aria-current', 'date');
  await userEvent.click(screen.getByRole('gridcell', { name: '17' }));
  expect(change).toHaveBeenLastCalledWith('2026-11-17');
  await userEvent.click(screen.getByRole('button', { name: 'OK' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('closes a pending popup and does not reopen it when pending ends', async () => {
  const field = <MuiInputDate label="Delivery" value="2026-11-16"
    referenceDate="2026-11-01" onValueChange={vi.fn()} />;
  const view = render(<FormPendingContext value={false}>{field}</FormPendingContext>);
  await userEvent.click(screen.getByRole('button', { name: /Choose date/ }));
  expect(screen.getByRole('dialog')).toBeVisible();
  view.rerender(<FormPendingContext value={true}>{field}</FormPendingContext>);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  view.rerender(<FormPendingContext value={false}>{field}</FormPendingContext>);
  expect(screen.queryByRole('dialog')).toBeNull();
});
