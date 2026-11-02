import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiVStack } from './v-stack.adapter.js';
it('composes vertical content using Material Stack', () => {
  render(
    <MuiVStack>
      <Typography>Content</Typography>
    </MuiVStack>,
  );
  expect(screen.getByText('Content').parentElement?.className).toContain(
    'MuiStack-root',
  );
});
