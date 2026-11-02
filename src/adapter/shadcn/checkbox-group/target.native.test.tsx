import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnCheckboxGroup } from './checkbox-group.adapter.js';

it('uses a policy-sized native label while retaining the SDK control', async () => {
  const change = vi.fn();
  render(
    <ShadcnCheckboxGroup
      label="Delivery"
      value={[]}
      items={[
        {
          value: 'standard',
          label: 'Standard delivery',
          description: 'Tracking details.',
        },
      ]}
      onValueChange={change}
    />,
  );
  const control = screen.getByRole('checkbox', { name: 'Standard delivery' });
  const label = screen.getByText('Standard delivery').closest('label');
  expect(label).toHaveAttribute('data-slot', 'field-label');
  expect(label).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  expect(label).not.toHaveTextContent('Tracking details.');
  expect(control).toHaveAccessibleDescription('Tracking details.');
  expect(control.className).toContain('h-4');
  await userEvent.click(screen.getByText('Standard delivery'));
  expect(change).toHaveBeenCalledExactlyOnceWith(['standard']);
});
