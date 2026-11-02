import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiCollapsible } from './collapsible.adapter.js';
it('uses Material Collapse and native button disclosure', async () => {
  const change = vi.fn<(open: boolean) => void>();
  const view = render(
    <MuiCollapsible label="Details" open={false} onOpenChange={change}>
      <Typography>Content</Typography>
    </MuiCollapsible>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Details' }));
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <MuiCollapsible label="Details" open onOpenChange={change} retainContent>
      <Typography>Content</Typography>
    </MuiCollapsible>,
  );
  const region = screen.getByRole('region', { name: 'Details' });
  expect(region.contains(screen.getByText('Content'))).toBe(true);
  expect(region.className).toContain('MuiCollapse-root');
});
