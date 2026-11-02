import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageLinks } from './page-links.adapter.js';

it('renders SDK native links with title, leading content and safe windows', () => {
  const view = render(
    <ShadcnPageLinks
      label="References"
      title="Related guides"
      activeKey="local"
      links={[
        { key: 'local', label: 'Local', href: '#local', leading: 'Guide' },
        { key: 'web', label: 'Web', href: 'https://react.dev', newWindow: true },
      ]}
    />,
  );
  expect(screen.getByRole('heading', { name: 'Related guides' })).toBeVisible();
  const local = screen.getByRole('link', { name: 'Guide Local' });
  expect(local).toHaveAttribute('data-slot', 'navigation-menu-link');
  expect(local).toHaveAttribute('href', '#local');
  expect(local).toHaveAttribute('aria-current', 'page');
  expect(local).not.toHaveAttribute('target');
  const web = screen.getByRole('link', { name: 'Web' });
  expect(web).not.toHaveAttribute('aria-current');
  expect(web).toHaveAttribute('target', '_blank');
  expect(web).toHaveAttribute('rel', 'noopener noreferrer');
  view.rerender(<ShadcnPageLinks label="References" />);
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.queryByRole('link')).toBeNull();
});
