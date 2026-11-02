import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnNavigation } from './navigation.adapter.js';

it('uses SDK navigation buttons with controlled current state', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const content = (
    <ShadcnNavigation
      label="Sections"
      value="home"
      onValueChange={change}
      items={[
        { value: 'home', label: 'Home' },
        { value: 'orders', label: 'Orders' },
      ]}
    />
  );
  const view = render(content);
  expect(screen.getByRole('navigation', { name: 'Sections' })).toHaveAttribute(
    'data-slot', 'navigation-menu',
  );
  expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute(
    'aria-current', 'page',
  );
  const orders = screen.getByRole('button', { name: 'Orders' });
  expect(orders.className).toContain('whitespace-normal');
  expect(orders).toHaveStyle({ height: 'auto', overflowWrap: 'anywhere' });
  expect(orders).not.toHaveAttribute('aria-current');
  await user.click(orders);
  expect(change).toHaveBeenLastCalledWith('orders');
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenCalledTimes(2);
  view.rerender(
    <PortalActiveContext value={false}>{content}</PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Orders' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Orders' }));
  expect(change).toHaveBeenCalledTimes(2);
});
