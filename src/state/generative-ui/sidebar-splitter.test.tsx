import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GenerativeUI,
  createDocumentState,
  validateGenerativeDocument,
} from '../../generative.js';
import { ReacdProvider } from '../../index.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundSidebar } from './bound-sidebar.js';
import { BoundSplitter } from './bound-splitter.js';
import {
  sidebarSplitterBindings,
} from '../../schema/generative-v2/sidebar-splitter-bindings.js';
import { success } from '../../../test-support/data-table.js';
import {
  installLayout,
  resizeContainers,
} from '../../../test-support/layout-observer.js';

const value = [
  { id: 'outline', share: 50 },
  { id: 'content', share: 50 },
];
const panels = [
  { id: 'outline', label: 'Outline', minShare: 20, maxShare: 80, content: [] },
  { id: 'content', label: 'Content', minShare: 20, maxShare: 80, content: [] },
];
const sidebar = {
  type: 'Sidebar' as const,
  title: 'Navigation',
  children: [],
  open: { state: 'desktop', mode: 'readWrite' as const },
  mobileOpen: { state: 'mobile', mode: 'readWrite' as const },
};
const splitter = {
  type: 'Splitter' as const,
  label: 'Panes',
  panels,
  value: { state: 'layout', mode: 'readWrite' as const },
};
const definitions = [
  { key: 'desktop', kind: 'boolean', initial: true, access: 'readWrite' },
  { key: 'mobile', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'layout', kind: 'panelLayout', initial: value, access: 'readWrite' },
];
let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

describe('Sidebar/Splitter generative state', () => {
  it('writes booleans and layouts to isolated registries', async () => {
    const document = success(
      validateGenerativeDocument({
        schemaVersion: '0.2',
        state: definitions,
        root: { type: 'VStack', children: [sidebar, splitter] },
      }),
    );
    const registry = createDocumentState(document);
    const isolated = createDocumentState(document);
    render(<GenerativeUI document={document} registry={registry} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(success(registry.read('desktop')).value).toBe(false);
    expect(success(registry.read('mobile')).value).toBe(false);
    expect(success(isolated.read('desktop')).value).toBe(true);
    const handle = screen.getByRole('separator', { name: 'Outline' });
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(success(registry.read('layout')).value).toEqual([
      { id: 'outline', share: 51 },
      { id: 'content', share: 49 },
    ]);
    expect(
      registry.update('layout', [
        { id: 'outline', share: 5 },
        { id: 'content', share: 95 },
      ]).success,
    ).toBe(false);
    resizeContainers(320);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(success(registry.read('mobile')).value).toBe(true);
    expect(success(registry.read('desktop')).value).toBe(false);
  });

  it('preflights missing keys, read-only state and incompatible layouts', () => {
    for (const state of [
      [],
      [{ key: 'layout', kind: 'panelLayout', initial: value, access: 'read' }],
      [{ key: 'layout', kind: 'text', initial: '', access: 'readWrite' }],
      [
        {
          key: 'layout',
          kind: 'panelLayout',
          initial: [
            { id: 'outline', share: 5 },
            { id: 'content', share: 95 },
          ],
          access: 'readWrite',
        },
      ],
    ])
      expect(
        validateGenerativeDocument({ schemaVersion: '0.2', state, root: splitter })
          .success,
      ).toBe(false);
    expect(sidebarSplitterBindings({ type: 'Text', content: 'Unbound' })).toEqual([]);
  });

  it('rejects missing references at each bound render boundary', () => {
    const registry = success(createStateRegistry(definitions));
    const view = render(
      <ReacdProvider>
        <BoundSidebar
          node={{ ...sidebar, open: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          content={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    view.rerender(
      <ReacdProvider>
        <BoundSidebar
          node={{ ...sidebar, mobileOpen: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          content={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    view.rerender(
      <ReacdProvider>
        <BoundSplitter
          node={{ ...splitter, value: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          panels={panels}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
  });

  it('validates every sidebar slot and panel action before rendering', () => {
    const action = () => ({ type: 'Button', label: 'Action', action: 'run' });
    const document = {
      schemaVersion: '0.2',
      state: definitions,
      root: {
        type: 'VStack',
        children: [
          {
            ...sidebar,
            header: [action()],
            footer: [action()],
            actions: [action()],
            collapsedContent: [action()],
            children: [action()],
          },
          {
            ...splitter,
            panels: panels.map((panel) => ({ ...panel, content: [action()] })),
          },
        ],
      },
    };
    const view = render(<GenerativeUI document={document} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
    const run = vi.fn();
    view.rerender(<GenerativeUI document={document} actions={{ run }} />);
    expect(screen.queryByRole('alert')).toBeNull();
    const first = screen.getAllByRole('button', { name: 'Action' })[0];
    if (!first) throw new Error('Missing declared slot action.');
    fireEvent.click(first);
    expect(run).toHaveBeenCalledOnce();
  });

  it('keeps constraints active for host transactions and reset', () => {
    const document = success(
      validateGenerativeDocument({
        schemaVersion: '0.2',
        state: definitions,
        root: splitter,
      }),
    );
    const registry = createDocumentState(document);
    render(<GenerativeUI document={document} registry={registry} />);
    act(() => {
      expect(
        registry.update('layout', [
          { id: 'outline', share: 60 },
          { id: 'content', share: 40 },
        ]).success,
      ).toBe(true);
    });
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '60');
    act(() => {
      expect(registry.reset().success).toBe(true);
    });
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '50');
  });
});
