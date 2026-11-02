import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSwitch } from './switch.adapter.js';

it('maps controlled and read-only switches to SDK behavior', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSwitch label="Alerts" checked={false} onCheckedChange={change} />,
  );
  const control = screen.getByRole('switch', { name: 'Alerts' });
  await userEvent.click(control);
  expect(change).toHaveBeenCalledWith(true);
  change.mockClear();
  view.rerender(
    <ShadcnSwitch
      label="Alerts"
      checked
      onCheckedChange={change}
      description="Project activity"
      readOnly
    />,
  );
  expect(control).toHaveAccessibleDescription('Project activity');
  await userEvent.click(control);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnSwitch label="Alerts" checked onCheckedChange={change} loading />,
  );
  expect(control).not.toBeDisabled();
  expect(control).toHaveAttribute('aria-busy', 'true');
});
