import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageSection } from './page-section.adapter.js';
it('preserves native page introduction, regions and orientation', () => {
  const view = render(
    <MuiPageSection
      title="Overview"
      headline="Workspace"
      description="Workspace details"
      links={<Typography>Links</Typography>}
      header="Header"
      footer="Footer"
      top="Top"
      bottom="Bottom"
      anchor="section"
      leading="Leading"
      features="Features"
      orientation="horizontal"
      reverse
    >
      <Typography>Content</Typography>
    </MuiPageSection>,
  );
  expect(screen.getByRole('heading', { name: 'Overview' }).className).toContain(
    'MuiTypography-root',
  );
  expect(screen.getByText('Content').closest('section')).not.toBeNull();
  expect(screen.getByText('Workspace details')).toBeVisible();
  expect(screen.getByText('Links')).toBeVisible();
  view.rerender(<MuiPageSection />);
  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
});
