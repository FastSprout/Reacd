import { render, screen, within } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPageAside } from './page-aside.adapter.js';
it('preserves the named complementary region and all declared slots', () => {
  render(
    <MuiPageAside
      label="On this page"
      top={<Typography>Top</Typography>}
      bottom={<Typography>Bottom</Typography>}
    >
      <Typography>Content</Typography>
    </MuiPageAside>,
  );
  const region = screen.getByRole('complementary', { name: 'On this page' });
  expect(region.className).toContain('MuiStack-root');
  for (const text of ['Top', 'Content', 'Bottom']) {
    expect(within(region).getByText(text)).toBeVisible();
  }
});
