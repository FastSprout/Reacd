import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageAnchors } from './page-anchors.adapter.js';
it('uses native Material links with active and new-window semantics', () => {
  const view = render(
    <MuiPageAnchors
      label="Sections"
      activeKey="overview"
      links={[
        { key: 'overview', label: 'Overview', href: '#overview' },
        {
          key: 'reference',
          label: 'Reference',
          href: 'https://reacd.dev/',
          newWindow: true,
          leading: <Typography>Docs</Typography>,
        },
      ]}
    />,
  );
  const overview = screen.getByRole('link', { name: 'Overview' });
  expect(overview.className).toContain('MuiListItemButton-root');
  expect(overview).toHaveAttribute('aria-current');
  expect(screen.getByRole('link', { name: 'Docs Reference' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  view.rerender(<MuiPageAnchors label="Sections" />);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
