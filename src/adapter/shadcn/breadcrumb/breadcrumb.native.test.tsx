import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnBreadcrumb } from './breadcrumb.adapter.js';

it('preserves native targets, current items and plain labels', async () => {
  const press = vi.fn();
  const view = render(
    <ShadcnBreadcrumb
      label="Path"
      items={[
        { key: 'root', label: 'Home', href: '/' },
        { key: 'group', label: 'Group' },
        { key: 'action', label: 'Select', onPress: press },
      ]}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'Path' })).toHaveAttribute(
    'data-slot',
    'breadcrumb',
  );
  expect(screen.getByRole('list')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  await userEvent.click(screen.getByRole('button', { name: 'Select' }));
  expect(press).toHaveBeenCalledWith();
  expect(screen.getByRole('button', { name: 'Select' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  view.rerender(
    <ShadcnBreadcrumb
      label="Path"
      separator="slash"
      items={[
        { key: 'disabled', label: 'Blocked', href: '/blocked', disabled: true },
        { key: 'action', label: 'No action', onPress: press, disabled: true },
        { key: 'current', label: 'Current', href: '/current' },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Blocked' })).not.toHaveAttribute('href');
  expect(screen.getByRole('button', { name: 'No action' })).toBeDisabled();
  expect(screen.getByRole('link', { name: 'Current' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await userEvent.click(screen.getByRole('button', { name: 'No action' }));
  expect(press).toHaveBeenCalledOnce();
  view.rerender(
    <ShadcnBreadcrumb
      label="Path"
      items={[{ key: 'current', label: 'Plain current' }]}
    />,
  );
  expect(screen.getByText('Plain current')).toHaveAttribute('aria-current', 'page');
});
