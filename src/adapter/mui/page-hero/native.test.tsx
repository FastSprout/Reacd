import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageHero } from './page-hero.adapter.js';
it('preserves native page introduction, regions and orientation', () => {
  const view = render(
    <MuiPageHero
      title="Overview"
      headline="Workspace"
      description="Workspace details"
      links={<Typography>Links</Typography>}
      header="Header"
      footer="Footer"
      top="Top"
      bottom="Bottom"
      orientation="horizontal"
      reverse
    >
      <Typography>Content</Typography>
    </MuiPageHero>,
  );
  expect(screen.getByRole('heading', { name: 'Overview' }).className).toContain(
    'MuiTypography-root',
  );
  expect(screen.getByText('Content').closest('section')).not.toBeNull();
  expect(screen.getByText('Workspace details')).toBeVisible();
  expect(screen.getByText('Links')).toBeVisible();
  view.rerender(<MuiPageHero />);
  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
});
