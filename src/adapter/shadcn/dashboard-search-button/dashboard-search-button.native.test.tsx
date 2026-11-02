import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnDashboardSearchButton } from './dashboard-search-button.adapter.js';

it('focuses its native SDK opener and isolates logical callbacks', async () => {
  const press = vi.fn();
  const view = render(<ShadcnDashboardSearchButton onPress={press} />);
  const button = screen.getByRole('button', { name: 'Search dashboard' });
  await userEvent.click(button);
  expect(button).toHaveFocus();
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(button.classList.contains('border-input')).toBe(true);
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnDashboardSearchButton label="Find" onPress={press} />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Find' })).toBeDisabled();
});
