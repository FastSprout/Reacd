import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PortalHostContext } from '../../../renderer/theme/portal-context.js';
import { MuiNavigationMenu } from './navigation-menu.adapter.js';
import { MuiCommandPalette } from '../command-palette/command-palette.adapter.js';

it('keeps RTL group links inside their declaring native portal host', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const view = render(<ThemeProvider theme={createTheme({ direction: 'rtl' })}>
    <PortalHostContext value={host}>
      <MuiNavigationMenu label="Resources" items={[
        { key: 'group', label: 'Guides', children: [
          { key: 'guide', label: 'Guide', href: '/guide/' },
        ] },
        { key: 'locked', label: 'Unavailable group', disabled: true, children: [
          { key: 'hidden', label: 'Hidden guide', href: '/hidden/' },
        ] },
      ]} />
    </PortalHostContext>
  </ThemeProvider>);
  try {
    const trigger = screen.getByRole('button', { name: 'Guides' });
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(screen.getByRole('button', { name: 'Unavailable group' })).toBeDisabled();
    await userEvent.click(trigger);
    const group = await screen.findByRole('group', { name: 'Guides' });
    expect(host.contains(group)).toBe(true);
    expect(group.closest('.MuiMenu-paper')).toHaveAttribute('dir', 'rtl');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('group', { name: 'Guides' }))
      .toBeNull());
    expect(trigger).toHaveFocus();
  } finally {
    view.unmount();
    host.remove();
  }
});

it('renders deterministic native command declarations and closed menus on SSR', () => {
  const content = <>
    <MuiCommandPalette label="Commands" query="draft" onQueryChange={() => undefined}
      groups={[{ key: 'work', label: 'Workspace', items: [
        { key: 'draft', label: 'Draft', onPress: () => undefined },
      ] }]} />
    <MuiNavigationMenu label="Resources" items={[
      { key: 'guide', label: 'Guide', href: '/guide/' },
      { key: 'group', label: 'Tools', children: [
        { key: 'tool', label: 'Tool', onPress: () => undefined },
      ] },
    ]} />
  </>;
  const first = renderToString(content);
  expect(renderToString(content)).toBe(first);
  expect(first).toContain('role="combobox"');
  expect(first).toContain('aria-expanded="false"');
  expect(first).not.toContain('role="group" aria-label="Tools"');
});
