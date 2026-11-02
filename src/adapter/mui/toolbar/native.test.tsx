import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiToolbar } from './toolbar.adapter.js';
it('uses the actual Material Toolbar', () => {
  render(
    <MuiToolbar label="Actions">
      <Typography>Commands</Typography>
    </MuiToolbar>,
  );
  expect(screen.getByRole('toolbar', { name: 'Actions' }).className).toContain(
    'MuiToolbar-root',
  );
});
