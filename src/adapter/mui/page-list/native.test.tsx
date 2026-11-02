import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageList } from './page-list.adapter.js';
it('composes a semantic Material List and optional Divider', () => {
  const content = (
    <>
      <Typography>First</Typography>
      <Typography>Second</Typography>
    </>
  );
  const view = render(<MuiPageList>{content}</MuiPageList>);
  expect(screen.getByText('First').closest('.MuiList-root')).not.toBeNull();
  view.rerender(
    <MuiPageList divide>
      <Typography>First</Typography>
      <Typography>Second</Typography>
    </MuiPageList>,
  );
  expect(screen.getByRole('separator').className).toContain('MuiDivider-root');
});
