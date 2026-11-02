import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnProgressGroup } from './progress-group.adapter.js';

it('normalizes native segments and retains complete aggregate and legend data', () => {
  const items = [
    { id: 'first', label: 'Applications', value: 150, intent: 'danger' as const },
    { id: 'second', label: 'Documents', value: 50 },
    { id: 'third', label: 'Empty', value: -1, intent: 'secondary' as const },
  ];
  const view = render(<ShadcnProgressGroup label="Capacity" items={items} />);
  expect(screen.getByRole('progressbar', { name: 'Capacity' })).toHaveAttribute(
    'aria-valuenow',
    '100',
  );
  expect(screen.getByText('Applications: 100 / 100')).toBeVisible();
  expect(screen.getByText('100 / 100', { exact: true })).toBeVisible();
  view.rerender(
    <ShadcnProgressGroup label="Capacity" max={200}
      items={[{ id: 'free', label: 'Unallocated', value: 0 }]} showStatus={false} />,
  );
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  expect(screen.queryByText('0 / 200', { exact: true })).toBeNull();
});
