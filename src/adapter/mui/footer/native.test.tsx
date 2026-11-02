import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiFooter } from './footer.adapter.js';
it('preserves every footer slot through native Material layout', () => {
  render(
    <MuiFooter
      start={<Typography>Start</Typography>}
      end={<Typography>End</Typography>}
      top={<Typography>Top</Typography>}
      bottom={<Typography>Bottom</Typography>}
    >
      <Typography>Content</Typography>
    </MuiFooter>,
  );
  const footer = screen.getByRole('contentinfo');
  expect(footer.className).toContain('MuiStack-root');
  for (const text of ['Start', 'End', 'Top', 'Bottom', 'Content']) {
    expect(screen.getByText(text).closest('footer')).toBe(footer);
  }
});
