import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiPageFeature } from './page-feature.adapter.js';
it('uses native Material Button and Link for named feature actions', async () => {
  const press = vi.fn<() => void>();
  const view = render(
    <MuiPageFeature
      title="Settings"
      onPress={press}
      description="Workspace preferences"
      leading={<Typography>Leading</Typography>}
    >
      <Typography>Content</Typography>
    </MuiPageFeature>,
  );
  const button = screen.getByRole('button', { name: 'Settings' });
  expect(button.className).toContain('MuiButton-root');
  await userEvent.click(button);
  expect(press).toHaveBeenCalledWith();
  view.rerender(
    <MuiPageFeature
      title="Settings"
      href="/settings"
      newWindow
      orientation="vertical"
    />,
  );
  expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  view.rerender(<MuiPageFeature title="Settings" href="/settings" />);
  expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('target');
  view.rerender(<MuiPageFeature title="Settings" />);
  expect(screen.getByRole('heading', { name: 'Settings' })).toBeVisible();
  view.rerender(<MuiPageFeature />);
  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
});
