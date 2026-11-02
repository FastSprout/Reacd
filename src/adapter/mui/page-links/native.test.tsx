import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageLinks } from './page-links.adapter.js';
it('uses native Material links with active and new-window semantics', () => {
  const view = render(
    <MuiPageLinks
      label="Sections"
      title="Pages"
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
  expect(getComputedStyle(overview).flexWrap).toBe('wrap');
  const leading = screen.getByText('Docs').closest('.MuiListItemIcon-root');
  if (!(leading instanceof HTMLElement)) throw new Error('Expected native leading.');
  expect(getComputedStyle(leading).minWidth).toBe('0px');
  expect(getComputedStyle(leading).maxWidth).toBe('100%');
  expect(overview).toHaveAttribute('aria-current');
  expect(screen.getByRole('link', { name: 'Docs Reference' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  view.rerender(<MuiPageLinks label="Sections" />);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
