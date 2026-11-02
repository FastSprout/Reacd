import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnDashboardSearch } from './dashboard-search.adapter.js';

it('uses the SDK command dialog and closes only after accepted selection', async () => {
  const change = vi.fn();
  const select = vi.fn().mockReturnValue(false);
  const props = {
    label: 'Destinations',
    query: '',
    onQueryChange: vi.fn(),
    groups: [
      { key: 'pages', label: 'Pages', items: [{ key: 'settings', label: 'Settings' }] },
    ],
    onSelect: select,
    open: true,
    onOpenChange: change,
  };
  const view = render(<ShadcnDashboardSearch {...props} />);
  expect(screen.getByRole('dialog', { name: 'Search dashboard' })).toBeVisible();
  await userEvent.click(screen.getByRole('option', { name: 'Settings' }));
  expect(change).not.toHaveBeenCalled();
  select.mockReturnValue(undefined);
  view.rerender(
    <ShadcnDashboardSearch
      {...props}
      title="Find pages"
      description="Find an application page."
    />,
  );
  await userEvent.click(screen.getByRole('option', { name: 'Settings' }));
  await waitFor(() => expect(change).toHaveBeenCalledWith(false));
});
