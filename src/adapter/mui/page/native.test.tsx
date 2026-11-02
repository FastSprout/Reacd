import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { MuiPage } from './page.adapter.js';
it('uses Material layout and preserves page regions and headings', () => {
  render(
    <MuiPage
      title="Orders"
      subtitle="Workspace"
      anchor="orders"
      left={<Typography>Navigation</Typography>}
      right={<Typography>Help</Typography>}
    >
      <Typography>Body</Typography>
    </MuiPage>,
  );
  expect(screen.getByRole('heading', { name: 'Orders' })).toHaveAttribute(
    'id',
    'orders',
  );
  expect(screen.getByRole('heading', { name: 'Orders' }).className).toContain(
    'MuiTypography-root',
  );
  for (const text of ['Navigation', 'Help', 'Body'])
    expect(screen.getByText(text)).toBeVisible();
});
