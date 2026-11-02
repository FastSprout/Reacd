import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DocumentationNavigation } from './navigation.js';

it('filters native navigation while retaining a valid expanded tree', async () => {
  const user = userEvent.setup();
  render(<ReacdProvider>
    <DocumentationNavigation route="/button/" items={[{
      key: 'components', label: 'Components', children: [
        { key: 'button', label: 'Button', href: '/button/' },
        { key: 'grid', label: 'Grid', href: '/grid/' },
      ],
    }]} />
  </ReacdProvider>);
  const filter = screen.getByRole('textbox', { name: 'Filter navigation' });
  await user.type(filter, 'Grid');
  expect(screen.getByRole('link', { name: 'Grid' })).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Button' })).toBeNull();
  await user.clear(filter);
  expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute(
    'aria-current', 'location',
  );
  await user.click(screen.getByRole('button', { name: 'Components' }));
  expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute(
    'aria-expanded', 'false',
  );
});
