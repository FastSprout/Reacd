import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundContentSearch } from './bound-content-search.js';
import { BoundContentSearchButton } from './bound-content-search-button.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
    { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
    { key: 'selection', kind: 'text', initial: '', access: 'readWrite' },
  ],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'ContentSearchButton',
        label: 'Open generated search',
        open: { state: 'open', mode: 'readWrite' },
      },
      {
        type: 'ContentSearch',
        title: 'Generated search',
        label: 'Generated query',
        open: { state: 'open', mode: 'readWrite' },
        query: { state: 'query', mode: 'readWrite' },
        selection: { state: 'selection', mode: 'readWrite' },
        footer: [{ type: 'Button', label: 'Footer help', action: 'help' }],
        groups: [
          {
            key: 'docs',
            label: 'Docs',
            items: [{ key: 'guide', label: 'Guide', action: 'read' }],
          },
        ],
      },
    ],
  },
});

it('commits selection and closes before invoking the action', async () => {
  const user = userEvent.setup();
  const registry = createDocumentState(declaration);
  const help = vi.fn();
  const read = vi.fn(() => {
    expect(registry.read('selection')).toMatchObject({ data: { value: 'guide' } });
    expect(registry.read('open')).toMatchObject({ data: { value: false } });
  });
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={declaration}
      registry={registry}
      actions={{ help, read }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Open generated search' }));
  await user.type(screen.getByRole('combobox', { name: 'Generated query' }), 'guide');
  await user.click(screen.getByRole('button', { name: 'Footer help' }));
  expect(help).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('option', { name: 'Guide' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(read).toHaveBeenCalledOnce();
  expect(registry.read('query')).toMatchObject({ data: { value: 'guide' } });
});

it('vetoes selection atomically and recovers inside the dialog', async () => {
  const user = userEvent.setup();
  const registry = createDocumentState(declaration);
  const read = vi.fn();
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={declaration}
      registry={registry}
      actions={{ help: vi.fn(), read }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Open generated search' }));
  const locked = registry.constrain(['open'], (get) => {
    const value = get('open');
    return value.success && value.data.value === false
      ? {
          success: false,
          issues: [{ path: 'open', message: 'Keep search open.' }],
        }
      : { success: true, data: undefined };
  });
  if (!locked.success) throw new Error('Expected open constraint.');
  await user.click(screen.getByRole('option', { name: 'Guide' }));
  expect(screen.getByRole('dialog').querySelector('[role="alert"]')).toHaveTextContent(
    'Keep search open.',
  );
  expect(registry.read('selection')).toMatchObject({ data: { value: '' } });
  expect(read).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByRole('alert')).toHaveTextContent('Keep search open.');
  locked.data();
  await user.click(screen.getByRole('option', { name: 'Guide' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(read).toHaveBeenCalledOnce();
});

it('supports persistent selection and explicit dismissal', async () => {
  const user = userEvent.setup();
  const read = vi.fn();
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      actions={{ read }}
      document={{
        ...declaration,
        root: {
          type: 'ContentSearch',
          title: 'Persistent search',
          label: 'Persistent query',
          triggerLabel: 'Open persistent',
          closeOnSelect: false,
          open: { state: 'open', mode: 'readWrite' },
          query: { state: 'query', mode: 'readWrite' },
          groups: [
            {
              key: 'docs',
              label: 'Docs',
              items: [{ key: 'guide', label: 'Persistent guide', action: 'read' }],
            },
          ],
        },
      }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Open persistent' }));
  await user.click(screen.getByRole('option', { name: 'Persistent guide' }));
  expect(read).toHaveBeenCalledOnce();
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close search' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('reports direct live binding failures without partially rendering controls', () => {
  if (declaration.root.type !== 'VStack') throw new Error('Expected stack.');
  const search = declaration.root.children.find(
    (node) => node.type === 'ContentSearch',
  );
  const button = declaration.root.children.find(
    (node) => node.type === 'ContentSearchButton',
  );
  if (!search || !button) throw new Error('Expected search and trigger.');
  const empty = createDocumentState(
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [],
      root: { type: 'VStack', children: [] },
    }),
  );
  const view = render(
    <BoundContentSearch
      node={search}
      registry={empty}
      actions={{}}
      renderChild={() => null}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  const openOnly = createDocumentState(
    defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [{ key: 'open', kind: 'boolean', initial: false, access: 'readWrite' }],
      root: { type: 'VStack', children: [] },
    }),
  );
  view.rerender(
    <BoundContentSearch
      node={search}
      registry={openOnly}
      actions={{}}
      renderChild={() => null}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  view.rerender(<BoundContentSearchButton node={button} registry={empty} />);
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('reports a rejected trigger write and clears the error after recovery', async () => {
  const user = userEvent.setup();
  const registry = createDocumentState(declaration);
  const constraint = registry.constrain(['open'], (get) => {
    const result = get('open');
    return result.success && result.data.value === true
      ? {
          success: false,
          issues: [{ path: 'open', message: 'Search is unavailable.' }],
        }
      : { success: true, data: undefined };
  });
  if (!constraint.success) throw new Error('Expected constraint.');
  if (declaration.root.type !== 'VStack') throw new Error('Expected stack.');
  const node = declaration.root.children.find(
    (item) => item.type === 'ContentSearchButton',
  );
  if (!node) throw new Error('Expected trigger.');
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundContentSearchButton node={node} registry={registry} />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('button');
  await user.click(trigger);
  expect(screen.getByRole('alert')).toHaveTextContent('Search is unavailable.');
  constraint.data();
  await user.click(trigger);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

it('preflights footer actions and rejects unknown state', () => {
  const view = render(<GenerativeUI adapter={shadcnAdapter} document={declaration} />);
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  view.rerender(
    <GenerativeUI adapter={shadcnAdapter} document={{ ...declaration, state: [] }} />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  expect(
    renderToString(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        actions={{ help: vi.fn(), read: vi.fn() }}
      />,
    ),
  ).not.toContain('role="alert"');
});
