import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiHeader } from './header.adapter.js';
it('uses Material AppBar/Toolbar and preserves each application shell slot', () => {
  const view = render(
    <MuiHeader
      title="Workspace"
      href="/"
      start={<Typography>Start</Typography>}
      end={<Typography>End</Typography>}
      top={<Typography>Top</Typography>}
      bottom={<Typography>Bottom</Typography>}
    >
      <Typography>Content</Typography>
    </MuiHeader>,
  );
  expect(screen.getByRole('banner').className).toContain('MuiAppBar-root');
  expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute('href', '/');
  for (const text of ['Start', 'End', 'Top', 'Bottom', 'Content']) {
    expect(screen.getByText(text)).toBeVisible();
  }
  view.rerender(<MuiHeader title="Workspace" />);
  expect(screen.getByText('Workspace')).toBeVisible();
});
it.each(['modal', 'slideover', 'drawer'] as const)(
  'delegates %s menu focus and dismissal to native Material overlays',
  async (mode) => {
    const change = vi.fn<(value: boolean) => void>();
    const menu = {
      mode,
      open: false,
      onOpenChange: change,
      content: <Typography>Menu content</Typography>,
    };
    const view = render(<MuiHeader title="Workspace" menu={menu} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(change).toHaveBeenLastCalledWith(true);
    view.rerender(<MuiHeader title="Workspace" menu={{ ...menu, open: true }} />);
    expect(await screen.findByText('Menu content')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
    expect(change).toHaveBeenLastCalledWith(false);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(change).toHaveBeenCalledWith(false));
  },
);

it('supports custom labels and the native default modal mode', async () => {
  const change = vi.fn<(value: boolean) => void>();
  const menu = {
    open: false,
    onOpenChange: change,
    toggleLabel: 'Menu',
    closeLabel: 'Dismiss',
    content: <Typography>Navigation</Typography>,
  };
  const view = render(<MuiHeader title="Workspace" menu={menu} />);
  await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
  expect(change).toHaveBeenLastCalledWith(true);
  view.rerender(<MuiHeader title="Workspace" menu={{ ...menu, open: true }} />);
  expect(screen.getByRole('dialog')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(change).toHaveBeenLastCalledWith(false);
});

it('deactivates menus and triggers in an inactive portal scope', () => {
  render(
    <PortalActiveContext value={false}>
      <MuiHeader
        title="Workspace"
        menu={{
          open: true,
          onOpenChange: () => undefined,
          content: <Typography>Navigation</Typography>,
        }}
      />
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Open navigation' })).toBeDisabled();
});

it('keeps generic navigation available and honors explicit compact replacement', () => {
  const menu = {
    open: false,
    onOpenChange: () => undefined,
    content: <Typography>Menu links</Typography>,
  };
  const view = render(
    <MuiHeader title="Site" menu={menu}>
      <Typography>Desktop links</Typography>
    </MuiHeader>,
  );
  expect(screen.getByRole('banner').hasAttribute('data-navigation-replacement')).toBe(
    false,
  );
  view.rerender(
    <MuiHeader title="Site" menu={{ ...menu, replacesNavigation: true }}>
      <Typography>Desktop links</Typography>
    </MuiHeader>,
  );
  expect(screen.getByRole('banner').getAttribute('data-navigation-replacement')).toBe(
    'true',
  );
  view.rerender(
    <MuiHeader title="Site" menu={{ ...menu, replacesNavigation: true }} />,
  );
  expect(screen.getByRole('banner').hasAttribute('data-navigation-replacement')).toBe(
    false,
  );
});
