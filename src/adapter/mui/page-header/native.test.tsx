import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageHeader } from './page-header.adapter.js';
it('keeps the named introduction and every slot in native Material components', () => {
  const view = render(
    <MuiPageHeader
      title="Settings"
      anchor="settings"
      headline="Workspace"
      description="Manage the workspace"
      links={<Typography>Links</Typography>}
    >
      <Typography>Content</Typography>
    </MuiPageHeader>,
  );
  expect(
    screen.getByRole('heading', { name: 'Settings', level: 1 }).className,
  ).toContain('MuiTypography-root');
  expect(screen.getByRole('heading', { name: 'Settings' })).toHaveAttribute(
    'id',
    'settings',
  );
  expect(screen.getByText('Manage the workspace')).toBeVisible();
  expect(screen.getByText('Workspace')).toBeVisible();
  expect(screen.getByText('Links')).toBeVisible();
  view.rerender(<MuiPageHeader />);
  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
});
