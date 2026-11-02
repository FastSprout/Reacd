import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiContainer } from './container.adapter.js';
it('uses the actual responsive Material Container', () => {
  render(
    <MuiContainer>
      <Typography>Body</Typography>
    </MuiContainer>,
  );
  expect(screen.getByText('Body').parentElement?.className).toContain(
    'MuiContainer-root',
  );
});
