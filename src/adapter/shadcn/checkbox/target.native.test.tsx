import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnCheckbox } from './checkbox.adapter.js';

it('uses the associated SDK label as the full native pointer target', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(
    <ShadcnCheckbox
      label="Summary"
      checked={false}
      description="Weekly mail"
      onCheckedChange={change}
    />,
  );
  const control = screen.getByRole('checkbox', { name: 'Summary' });
  const label = control.closest('label');
  expect(label).not.toBeNull();
  expect(label).toHaveStyle({ minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px` });
  expect(label).not.toHaveTextContent('Weekly mail');
  expect(control).toHaveAccessibleDescription('Weekly mail');
  expect(control.className).toContain('w-4');
  await userEvent.click(screen.getByText('Summary', { exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
