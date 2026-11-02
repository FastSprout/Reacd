import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageBody } from './page-body.adapter.js';
it('preserves content through native Material layout', () => {
  render(
    <MuiPageBody>
      <Typography>Content</Typography>
    </MuiPageBody>,
  );
  const content = screen.getByText('Content');
  expect(content.closest('.MuiStack-root')).not.toBeNull();
  expect(content.closest('article')).not.toBeNull();
});
