import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiMain } from './main.adapter.js';
it('preserves content through native Material layout', () => {
  render(
    <MuiMain>
      <Typography>Content</Typography>
    </MuiMain>,
  );
  const content = screen.getByText('Content');
  expect(content.closest('.MuiStack-root')).not.toBeNull();
  expect(content.closest('main')).not.toBeNull();
});
