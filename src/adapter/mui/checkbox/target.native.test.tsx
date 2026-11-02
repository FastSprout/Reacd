import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiCheckbox } from './checkbox.adapter.js';

it('bounds the native clickable label without resizing its icon', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(
    <MuiCheckbox
      label="Summary"
      checked={false}
      description="Weekly mail"
      onCheckedChange={change}
    />,
  );
  const control = screen.getByRole('checkbox', { name: 'Summary' });
  const label = control.closest('label');
  expect(label).toHaveStyle({
    minHeight: `${LAYOUT_POLICY.controlTargetPx}px`,
    margin: '0px',
    maxWidth: '100%',
  });
  expect(control).toHaveAccessibleDescription('Weekly mail');
  expect(label?.querySelector('svg')).not.toBeNull();
  await userEvent.click(screen.getByText('Summary', { exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
