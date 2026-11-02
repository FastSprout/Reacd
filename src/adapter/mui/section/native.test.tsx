import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiSection } from './section.adapter.js';
it('composes a named Material Stack section with a real heading', () => {
  render(
    <MuiSection title="Overview" description="Workspace details" anchor="overview">
      <Typography>Content</Typography>
    </MuiSection>,
  );
  expect(screen.getByRole('region', { name: 'Overview' }).className).toContain(
    'MuiStack-root',
  );
  expect(screen.getByRole('heading', { name: 'Overview' })).toHaveAttribute('id');
  expect(screen.getByText('Workspace details')).toBeVisible();
});
