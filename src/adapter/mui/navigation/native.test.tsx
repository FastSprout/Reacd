import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiNavigation } from './navigation.adapter.js';
it('uses Material ListItemButton navigation', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiNavigation
      label="Workspace"
      value="home"
      onValueChange={change}
      items={[
        { value: 'home', label: 'Home' },
        { value: 'orders', label: 'Orders' },
      ]}
    />,
  );
  const orders = screen.getByRole('button', { name: 'Orders' });
  expect(orders.className).toContain('MuiListItemButton-root');
  await userEvent.click(orders);
  expect(change).toHaveBeenCalledWith('orders');
});
