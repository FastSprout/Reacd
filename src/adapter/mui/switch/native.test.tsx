import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiSwitch } from './switch.adapter.js';

it('uses the real Material Switch and honors read-only changes', async () => {
  const change = vi.fn<(value: boolean) => void>();
  const view = render(
    <MuiSwitch
      label="Alerts"
      checked={false}
      onCheckedChange={change}
      description="Team activity"
    />,
  );
  const field = screen.getByRole('switch', { name: 'Alerts' });
  expect(field.closest('.MuiSwitch-root')).not.toBeNull();
  await userEvent.click(field);
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <MuiSwitch label="Alerts" checked={false} onCheckedChange={change} readOnly />,
  );
  await userEvent.click(field);
  expect(change).toHaveBeenCalledTimes(1);
});

it('announces pending activity while retaining the named canonical value', () => {
  render(
    <form aria-label="Settings">
      <MuiSwitch
        label="Alerts"
        checked
        name="alerts"
        loading
        onCheckedChange={() => undefined}
      />
    </form>,
  );
  expect(
    screen.getByRole('progressbar', { name: 'Updating Alerts' }),
  ).toBeInTheDocument();
  const form = screen.getByRole('form', { name: 'Settings' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form.');
  expect(new FormData(form).get('alerts')).toBe('on');
});
