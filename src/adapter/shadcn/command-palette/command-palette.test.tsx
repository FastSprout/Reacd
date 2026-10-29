import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, Modal, ReacdProvider, shadcnAdapter } from '../../../index.js';
import type { CommandPaletteProps } from '../../../components/command-palette/index.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';
import { ShadcnCommandPalette } from './command-palette.adapter.js';

vi.mock('../../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

function ControlledPalette({ action }: { action: () => void }) {
  const [query, setQuery] = useState('');
  return (
    <CommandPalette
      label="Find commands"
      query={query}
      onQueryChange={setQuery}
      groups={[
        {
          key: 'docs',
          label: 'Documentation',
          items: [
            {
              key: 'guide',
              label: 'Guide',
              description: 'Read the manual.',
              onPress: action,
            },
            { key: 'other', label: 'Other action', disabled: true, onPress: action },
          ],
        },
      ]}
    />
  );
}

function PaletteDialog() {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      title="Command dialog"
      description="Choose a command."
      open={open}
      onOpenChange={setOpen}
    >
      <ControlledPalette action={() => undefined} />
    </Modal>
  );
}

describe('shadcn CommandPalette', () => {
  it('lets the enclosing dialog own Escape dismissal', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <PaletteDialog />
      </ReacdProvider>,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'guide');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('activates by keyboard and preserves the controlled query', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ReacdProvider>
        <ControlledPalette action={action} />
      </ReacdProvider>,
    );
    const input = screen.getByRole('combobox', { name: 'Find commands' });
    await user.type(input, 'guide');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Read the manual.');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(action).toHaveBeenCalledOnce();
    expect(input).toHaveValue('guide');
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('guide');
    await user.clear(input);
    await user.type(input, 'unmatched');
    expect(screen.getByRole('status')).toHaveTextContent('No matching commands.');
  });

  it('vetoes pointer actions and then executes accepted callbacks', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const select = vi.fn<(key: string) => boolean | void>(() => false);
    const properties = {
      label: 'Actions',
      query: '',
      onQueryChange: vi.fn(),
      onSelect: select,
      groups: [
        {
          key: 'one',
          label: 'Actions',
          items: [
            { key: 'run', label: 'Run command', onPress: action },
            {
              key: 'disabled',
              label: 'Disabled command',
              disabled: true,
              onPress: action,
            },
          ],
        },
      ],
    };
    render(
      <ReacdProvider>
        <CommandPalette {...properties} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Run command' }));
    expect(select).toHaveBeenCalledWith('run');
    expect(action).not.toHaveBeenCalled();
    select.mockReturnValue(true);
    await user.click(screen.getByRole('option', { name: 'Run command' }));
    await user.click(screen.getByRole('option', { name: 'Disabled command' }));
    expect(action).toHaveBeenCalledOnce();
  });

  it('captures destinations before callbacks and supports callback items', async () => {
    const user = userEvent.setup();
    const item = { key: 'link', label: 'Navigate command', href: '/captured' };
    const select = vi.fn(() => {
      item.href = '/changed';
    });
    const properties: CommandPaletteProps = {
      label: 'Navigation commands',
      query: '',
      onQueryChange: vi.fn(),
      onSelect: select,
      groups: [
        {
          key: 'one',
          label: 'Navigation',
          items: [item, { key: 'callback', label: 'Callback command' }],
        },
      ],
    };
    render(<ShadcnCommandPalette {...properties} />);
    await user.click(screen.getByRole('option', { name: 'Navigate command' }));
    expect(followHref).toHaveBeenCalledWith('/captured');
    await user.click(screen.getByRole('option', { name: 'Callback command' }));
    expect(select).toHaveBeenCalledWith('callback');
  });

  it('fails closed for invalid runtime callback results', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ReacdProvider>
        {shadcnAdapter.components.CommandPalette.render({
          label: 'Invalid selection',
          query: '',
          onQueryChange: vi.fn(),
          onSelect: () => Promise.resolve(true),
          groups: [
            {
              key: 'one',
              label: 'Commands',
              items: [{ key: 'run', label: 'Never run', onPress: action }],
            },
          ],
        })}
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Never run' }));
    expect(screen.getByRole('alert')).toHaveTextContent('must return a boolean');
    expect(action).not.toHaveBeenCalled();
  });

  it('announces status and blocks stale or disabled options', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const properties: CommandPaletteProps = {
      label: 'Async commands',
      query: '',
      onQueryChange: vi.fn(),
      groups: [
        {
          key: 'one',
          label: 'Actions',
          items: [{ key: 'run', label: 'Stale command', onPress: action }],
        },
      ],
    };
    const view = render(
      <ReacdProvider>
        <CommandPalette {...properties} status="loading" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading commands.');
    await user.click(screen.getByRole('option', { name: 'Stale command' }));
    expect(action).not.toHaveBeenCalled();
    view.rerender(
      <ReacdProvider>
        <CommandPalette {...properties} status="error" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('could not be loaded');
    view.rerender(
      <ReacdProvider>
        <CommandPalette {...properties} disabled />
      </ReacdProvider>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
    await user.click(screen.getByRole('option', { name: 'Stale command' }));
    expect(action).not.toHaveBeenCalled();
  });

  it.each([13, 229])('defers composing Enter with key code %s', async (keyCode) => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ReacdProvider>
        <ControlledPalette action={action} />
      </ReacdProvider>,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'guide');
    await user.keyboard('{ArrowDown}');
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode });
    expect(action).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
  });
});
