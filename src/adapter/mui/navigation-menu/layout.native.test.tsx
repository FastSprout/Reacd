import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiCommandPalette } from '../command-palette/command-palette.adapter.js';
import { MuiNavigationMenu } from './navigation-menu.adapter.js';

it('retains one native column when a command loses focus to an action', async () => {
  const press = vi.fn();
  render(<>
    <MuiCommandPalette label="Commands" query="folder" onQueryChange={vi.fn()}
      onSelect={vi.fn()} groups={[{ key: 'files', label: 'Files', items: [
        { key: 'folder', label: 'Add new folder' },
      ] }]} />
    <MuiNavigationMenu label="Workspace" orientation="vertical" items={[
      { key: 'dashboard', label: 'Dashboard', active: true, onPress: vi.fn() },
      { key: 'projects', label: 'Projects', onPress: press },
    ]} />
  </>);
  await userEvent.click(screen.getByRole('combobox', { name: 'Commands' }));
  await userEvent.click(screen.getByRole('option', { name: 'Add new folder' }));
  expect(screen.getByRole('navigation', { name: 'Workspace' })).toHaveStyle({
    flexDirection: 'column', flexWrap: 'nowrap',
  });
  await userEvent.click(screen.getByRole('button', { name: 'Projects' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
});

it('retains native horizontal row wrapping', () => {
  render(<MuiNavigationMenu label="Workspace" items={[
    { key: 'projects', label: 'Projects', onPress: vi.fn() },
  ]} />);
  expect(screen.getByRole('navigation', { name: 'Workspace' })).toHaveStyle({
    flexDirection: 'row', flexWrap: 'wrap',
  });
});
