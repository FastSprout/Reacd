import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageColumns } from './page-columns.adapter.js';
it('keeps independent column flow in a native Material Box', () => {
  render(
    <MuiPageColumns>
      <Typography>One</Typography>
      <Typography>Two</Typography>
    </MuiPageColumns>,
  );
  expect(screen.getByText('One').closest('.MuiBox-root')).not.toBeNull();
  expect(screen.getByText('Two')).toBeVisible();
});
