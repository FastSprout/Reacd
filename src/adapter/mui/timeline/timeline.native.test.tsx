import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiTimeline } from './timeline.adapter.js';

it('keeps native controlled actions and logical progress when reversed', async () => {
  const items = [
    { id: 'plan', title: 'Plan', description: 'Scope', date: 'Monday' },
    { id: 'build', title: 'Build', disabled: true },
    { id: 'ship', title: 'Ship' },
  ];
  const change = vi.fn();
  const view = render(<MuiTimeline label="Release" items={items} />);
  expect(screen.getByText('Plan')).toHaveAttribute('aria-current', 'step');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <MuiTimeline
      label="Release"
      items={items}
      value="build"
      onValueChange={change}
      reverse
      orientation="horizontal"
      intent="danger"
    />,
  );
  const rows = screen.getAllByRole('listitem');
  expect(rows.map((row) => row.textContent)[0]).toContain('Upcoming');
  expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'Ship' }));
  expect(change).toHaveBeenCalledWith('ship');
  expect(screen.getByRole('button', { name: 'Build' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  expect(screen.getByText('Completed')).toBeVisible();
});
