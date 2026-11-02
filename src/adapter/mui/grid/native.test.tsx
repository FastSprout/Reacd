import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiGrid } from './grid.adapter.js';
it('maps each declared child through the Material Grid API', () => {
  render(
    <MuiGrid columns={3}>
      <Typography>Cell</Typography>
    </MuiGrid>,
  );
  expect(screen.getByText('Cell').parentElement?.className).toContain('MuiGrid-root');
  expect(screen.getByText('Cell').parentElement?.parentElement?.className).toContain(
    'MuiGrid-container',
  );
});
