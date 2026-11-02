import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiHStack } from './h-stack.adapter.js';
it('uses the responsive Material Stack API', () => {
  render(
    <MuiHStack>
      <Typography>Actions</Typography>
    </MuiHStack>,
  );
  expect(screen.getByText('Actions').parentElement?.className).toContain(
    'MuiStack-root',
  );
});
