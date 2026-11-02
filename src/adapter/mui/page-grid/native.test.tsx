import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageGrid } from './page-grid.adapter.js';
it('packs native grid tracks according to the parent container', () => {
  render(
    <MuiPageGrid>
      <Typography>One</Typography>
      <Typography>Two</Typography>
    </MuiPageGrid>,
  );
  expect(screen.getByText('One').closest('.MuiGrid-root')).not.toBeNull();
  expect(screen.getByText('Two')).toBeVisible();
});
