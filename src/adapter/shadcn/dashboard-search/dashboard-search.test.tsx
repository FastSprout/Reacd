import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  DashboardSearch,
  DashboardSearchButton,
  ReacdProvider,
  shadcnAdapter,
} from '../../../index.js';
import type { DashboardSearchProps } from
  '../../../components/dashboard-search/index.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';

vi.mock('../../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

function Scene({
  selected,
  pressed,
  ...properties
}: Partial<DashboardSearchProps> & {
  selected?: (key: string) => boolean | void;
  pressed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  return (
    <ReacdProvider>
      <DashboardSearchButton onPress={() => setOpen(true)} />
      <DashboardSearch
        label="Find workspace"
        groups={[
          {
            key: 'actions',
            label: 'Actions',
            items: [
              {
                key: 'inspect',
                label: 'Inspect inbox',
                keywords: ['review'],
                onPress: pressed,
              },
            ],
          },
        ]}
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        onSelect={selected}
        {...properties}
      />
    </ReacdProvider>
  );
}

describe('controlled dashboard search composition', () => {
  it('filters commands, executes accepted targets and restores focus', async () => {
    const user = userEvent.setup();
    const pressed = vi.fn();
    render(<Scene pressed={pressed} />);
    const trigger = screen.getByRole('button', { name: 'Search dashboard' });
    await user.click(trigger);
    const input = screen.getByRole('combobox', { name: 'Find workspace' });
    await user.type(input, 'review');
    await user.keyboard('{Enter}');
    expect(pressed).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await user.click(trigger);
    expect(screen.getByRole('combobox')).toHaveValue('review');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('honors selection veto before closing or invoking a target', async () => {
    const user = userEvent.setup();
    const pressed = vi.fn();
    const selected = vi.fn(() => false);
    const view = render(<Scene pressed={pressed} selected={selected} />);
    await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
    await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
    expect(pressed).not.toHaveBeenCalled();
    expect(selected).toHaveBeenCalledWith('inspect');
    expect(screen.getByRole('dialog')).toBeVisible();
    view.rerender(
      <Scene
        pressed={pressed}
        selected={() => true}
        title="Workspace search"
        description="Explicit workspace actions"
      />,
    );
    expect(screen.getByRole('dialog', { name: 'Workspace search' })).toBeVisible();
    await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
    expect(pressed).toHaveBeenCalledOnce();
  });

  it('blocks invalid selection returns and clears failure on edits', async () => {
    const user = userEvent.setup();
    const pressed = vi.fn();
    const changed = vi.fn();
    const properties: unknown = {
      label: 'Find workspace',
      query: '',
      open: true,
      onOpenChange: changed,
      onQueryChange: changed,
      onSelect: () => Promise.resolve(true),
      groups: [
        {
          key: 'actions',
          label: 'Actions',
          items: [{ key: 'inspect', label: 'Inspect inbox', onPress: pressed }],
        },
      ],
    };
    render(
      <ReacdProvider>
        {shadcnAdapter.components.DashboardSearch.render(properties)}
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Inspect inbox' }));
    expect(screen.getByRole('alert')).toHaveTextContent('must return a boolean');
    expect(pressed).not.toHaveBeenCalled();
    expect(changed).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'review' } });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(changed).toHaveBeenCalledWith('review');
  });

  it('supports links, explicit labels and disabled search buttons', async () => {
    const user = userEvent.setup();
    const pressed = vi.fn();
    const view = render(
      <ReacdProvider>
        <DashboardSearchButton label="Find workspace" onPress={pressed} disabled />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Find workspace' }));
    expect(pressed).not.toHaveBeenCalled();
    view.rerender(
      <ReacdProvider>
        <DashboardSearchButton label="Find workspace" onPress={pressed} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Find workspace' }));
    expect(pressed).toHaveBeenLastCalledWith();
    pressed.mockClear();
    view.rerender(
      <ReacdProvider>
        <DashboardSearch
          label="Find links"
          query=""
          open
          onOpenChange={pressed}
          onQueryChange={() => undefined}
          groups={[
            {
              key: 'links',
              label: 'Links',
              items: [{ key: 'guide', label: 'Read guide', href: '/guide' }],
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Read guide' }));
    expect(followHref).toHaveBeenCalledWith('/guide');
    expect(pressed).toHaveBeenCalledWith(false);
  });
});
