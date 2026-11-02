import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiSwitch } from './switch.adapter.js';

it('uses the associated native label as a bounded pointer target', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(
    <MuiSwitch
      label="Summary"
      checked={false}
      description="Weekly mail"
      onCheckedChange={change}
    />,
  );
  const control = screen.getByRole('switch', { name: 'Summary' });
  const label = control.closest('label');
  expect(label).not.toBeNull();
  expect(label).toHaveStyle({
    minHeight: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  expect(label).not.toHaveTextContent('Weekly mail');
  expect(control).toHaveAccessibleDescription('Weekly mail');
  await userEvent.click(screen.getByText('Summary', { exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
