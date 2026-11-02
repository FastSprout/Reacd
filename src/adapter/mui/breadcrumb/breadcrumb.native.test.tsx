import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { expect, it, vi } from 'vitest';
import { MuiBreadcrumb } from './breadcrumb.adapter.js';

it('preserves native targets, current items and disabled state', async () => {
  const press = vi.fn();
  const view = render(
    <MuiBreadcrumb
      label="Path"
      items={[
        { key: 'root', label: 'Home', href: '/' },
        { key: 'group', label: 'Group' },
        { key: 'action', label: 'Select', onPress: press },
      ]}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'Path' }).className).toContain(
    'MuiBreadcrumbs-root',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Select' }));
  expect(press).toHaveBeenCalledWith();
  expect(screen.getByRole('button', { name: 'Select' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  view.rerender(
    <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
      <MuiBreadcrumb
        label="Path"
        separator="slash"
        items={[
          { key: 'disabled', label: 'Blocked', href: '/blocked', disabled: true },
          { key: 'action', label: 'No action', onPress: press, disabled: true },
          { key: 'current', label: 'Current', href: '/current' },
        ]}
      />
    </ThemeProvider>,
  );
  expect(screen.getByRole('link', { name: 'Blocked' })).not.toHaveAttribute('href');
  expect(screen.getByRole('button', { name: 'No action' })).toBeDisabled();
  expect(screen.getByRole('link', { name: 'Current' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  fireEvent.click(screen.getByRole('button', { name: 'No action' }));
  expect(press).toHaveBeenCalledOnce();
  view.rerender(
    <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
      <MuiBreadcrumb
        label="RTL path"
        items={[
          { key: 'root', label: 'Root', href: '/' },
          { key: 'current', label: 'RTL current' },
        ]}
      />
    </ThemeProvider>,
  );
  expect(screen.getByRole('navigation', { name: 'RTL path' })).toBeVisible();
  view.rerender(
    <MuiBreadcrumb label="Path" items={[{ key: 'current', label: 'Plain current' }]} />,
  );
  expect(screen.getByText('Plain current')).toHaveAttribute('aria-current', 'page');
});
