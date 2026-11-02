import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { commandSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/command-palette/command-palette.schema.js';
import { ShadcnCommandPalette } from './command-palette.adapter.js';
import { followHref } from
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js';

vi.mock(
  '@fastsprout/reacd/adapter-runtime/renderer/navigation/native-navigation.js',
  () => ({ followHref: vi.fn() }),
);

it('delegates activation to SDK Command and preserves logical filtering', async () => {
  const press = vi.fn();
  const select = vi.fn();
  function View() {
    const [query, setQuery] = useState('');
    return (
      <ShadcnCommandPalette
        label="Find"
        query={query}
        onQueryChange={setQuery}
        onSelect={select}
        groups={[
          {
            key: 'pages',
            label: 'Pages',
            items: [
              {
                key: 'cafe',
                label: 'Café',
                description: 'Coffee',
                keywords: ['drink'],
                onPress: press,
              },
              { key: 'blocked', label: 'Unavailable', disabled: true },
            ],
          },
        ]}
      />
    );
  }
  const user = userEvent.setup();
  const view = render(<View />);
  expect(view.container.querySelector('[data-slot=command]')).toBeTruthy();
  const input = screen.getByRole('combobox', { name: 'Find' });
  await user.click(input);
  await user.type(input, 'cafe drink');
  expect(screen.queryByRole('option', { name: 'Unavailable' })).toBeNull();
  await user.keyboard('{ArrowDown}{Enter}');
  expect(select).toHaveBeenCalledWith('cafe');
  expect(press).toHaveBeenCalledWith();
  expect(input).toHaveValue('cafe drink');
});

it('preserves external order and blocks stale controls', async () => {
  const press = vi.fn();
  const query = vi.fn();
  const groups = [
    {
      key: 'pages',
      label: 'Pages',
      items: [{ key: 'button', label: 'Button', onPress: press }],
    },
  ];
  const view = render(
    <ShadcnCommandPalette
      label="Find"
      query="unmatched"
      onQueryChange={query}
      groups={groups}
      filtering="external"
    />,
  );
  expect(screen.getByRole('option', { name: 'Button' })).toBeVisible();
  await userEvent.click(screen.getByRole('option', { name: 'Button' }));
  expect(press).toHaveBeenCalledOnce();
  for (const status of ['loading', 'error'] as const) {
    view.rerender(
      <ShadcnCommandPalette
        label="Find"
        query="unmatched"
        onQueryChange={query}
        groups={groups}
        status={status}
      />,
    );
    expect(screen.getByRole('combobox')).not.toBeDisabled();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: `retry ${status}` },
    });
    expect(query).toHaveBeenLastCalledWith(`retry ${status}`);
    expect(screen.queryByRole('option')).toBeNull();
    expect(
      screen.getByText(
        status === 'loading' ? 'Loading commands.' : 'Commands could not be loaded.',
      ),
    ).toBeVisible();
  }
  query.mockClear();
  view.rerender(
    <ShadcnCommandPalette
      label="Find"
      query=""
      onQueryChange={query}
      groups={groups}
      disabled
    />,
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ignored' } });
  expect(query).not.toHaveBeenCalled();
});

it('vetoes selections and diagnoses invalid callback results', async () => {
  const press = vi.fn();
  const accepted = vi.fn();
  const groups = [
    {
      key: 'pages',
      label: 'Pages',
      items: [{ key: 'button', label: 'Button', onPress: press }],
    },
  ];
  const view = render(
    <ShadcnCommandPalette
      label="Find"
      query=""
      onQueryChange={vi.fn()}
      groups={groups}
      onSelect={() => false}
      onAccepted={accepted}
    />,
  );
  await userEvent.click(screen.getByRole('option', { name: 'Button' }));
  expect(press).not.toHaveBeenCalled();
  expect(accepted).not.toHaveBeenCalled();
  const invalid = [
    commandSelectSchema.parse(() => 'invalid'),
    commandSelectSchema.parse(async () => true),
    commandSelectSchema.parse(async () => {
      throw new Error('Invalid async');
    }),
    () => {
      throw new Error('Invalid synchronous');
    },
  ];
  for (const onSelect of invalid) {
    view.rerender(
      <ShadcnCommandPalette
        label="Find"
        query=""
        onQueryChange={vi.fn()}
        groups={groups}
        onSelect={onSelect}
        onAccepted={accepted}
      />,
    );
    await userEvent.click(screen.getByRole('option', { name: 'Button' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Selection callbacks');
  }
  expect(press).not.toHaveBeenCalled();
  expect(accepted).not.toHaveBeenCalled();
});

it('preserves IME and captures href before selection', async () => {
  const item = { key: 'button', label: 'Button', href: '/button/' };
  const query = vi.fn();
  const select = vi.fn(() => {
    item.href = '/changed/';
    return true;
  });
  render(
    <ShadcnCommandPalette
      label="Find"
      query=""
      onQueryChange={query}
      onSelect={select}
      groups={[{ key: 'pages', label: 'Pages', items: [item] }]}
    />,
  );
  const input = screen.getByRole('combobox');
  input.focus();
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
  expect(select).not.toHaveBeenCalled();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(followHref).toHaveBeenCalledWith('/button/');
});

it('shows status feedback and clears diagnostics on query edits', async () => {
  const query = vi.fn();
  const groups = [
    {
      key: 'pages',
      label: 'Pages',
      items: [{ key: 'button', label: 'Button', onPress: vi.fn() }],
    },
  ];
  const view = render(
    <ShadcnCommandPalette
      label="Find"
      query=""
      onQueryChange={query}
      groups={groups}
      onSelect={commandSelectSchema.parse(() => null)}
    />,
  );
  await userEvent.click(screen.getByRole('option'));
  expect(screen.getByRole('alert')).toBeVisible();
  await userEvent.type(screen.getByRole('combobox'), 'x');
  expect(screen.queryByRole('alert')).toBeNull();
  for (const status of ['ready', 'loading', 'error'] as const) {
    view.rerender(
      <ShadcnCommandPalette
        label="Find"
        query=""
        onQueryChange={query}
        groups={[]}
        status={status}
        emptyMessage="Nothing here"
        loadingMessage="Fetching pages"
        errorMessage="Fetch failed"
      />,
    );
    expect(
      screen.getByText(
        status === 'ready'
          ? 'Nothing here'
          : status === 'loading'
            ? 'Fetching pages'
            : 'Fetch failed',
      ),
    ).toBeVisible();
  }
});
