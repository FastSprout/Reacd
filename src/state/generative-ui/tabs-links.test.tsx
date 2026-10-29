import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Text } from '../../components/text/text.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { BoundTabs } from './bound-tabs.js';
import { GenerativeUI } from './generative-ui.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'tab', kind: 'text', initial: 'a', access: 'readWrite' }],
  root: {
    type: 'Tabs',
    label: 'Generated tabs',
    value: { state: 'tab', mode: 'readWrite' },
    children: [{ type: 'Link', label: 'Generated reference', href: '/' }],
    items: [
      { value: 'a', label: 'First' },
      {
        value: 'b',
        label: 'Second',
        content: [{ type: 'Button', label: 'Generated action', action: 'run' }],
      },
      { value: 'c', label: 'Unavailable', disabled: true },
    ],
  },
});
const tabs = declaration.root;
if (tabs.type !== 'Tabs') throw new Error('Expected Tabs declaration.');

describe('generative tabs and links', () => {
  it('writes accepted selection and validates actions in every item slot', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(<GenerativeUI document={declaration} actions={{ run }} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    await user.click(screen.getByRole('tab', { name: 'Second' }));
    await user.click(screen.getByRole('button', { name: 'Generated action' }));
    expect(run).toHaveBeenCalledOnce();
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      validateGenerativeDocument({
        ...declaration,
        root: { ...tabs, items: [tabs.items[0], tabs.items[0]] },
      }).success,
    ).toBe(false);
  });

  it('renders read-only selection and reports invalid references', () => {
    const read = {
      ...declaration,
      root: { ...tabs, value: { state: 'tab', mode: 'read' } },
    };
    const view = render(<GenerativeUI document={read} actions={{ run: vi.fn() }} />);
    expect(screen.getByRole('tab', { name: 'First' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Second' })).toBeDisabled();
    view.unmount();
    for (const state of [
      [],
      [{ key: 'tab', kind: 'text', initial: 'c', access: 'readWrite' }],
    ]) {
      const invalid = render(<GenerativeUI document={{ ...declaration, state }} />);
      expect(screen.getByRole('alert')).toBeVisible();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      invalid.unmount();
    }
    render(<GenerativeUI document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('run');
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('rejects live invalid selection and reports direct binding failure', async () => {
    const state = createDocumentState(declaration);
    const view = render(
      <GenerativeUI
        document={declaration}
        registry={state}
        actions={{ run: vi.fn() }}
      />,
    );
    expect(state.update('tab', 'missing').success).toBe(false);
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    view.unmount();
    const empty = createDocumentState(
      defineGenerativeDeclaration({
        ...declaration,
        state: [],
        root: { type: 'VStack', children: [] },
      }),
    );
    render(
      <BoundTabs node={tabs} registry={empty} renderChild={() => <Text>Child</Text>} />,
    );
    expect(screen.getByRole('alert')).toBeVisible();
  });

  it('hydrates connected panel IDs and retains isolated request state', async () => {
    const run = vi.fn();
    const container = document.createElement('div');
    container.innerHTML = renderToString(
      <GenerativeUI document={declaration} actions={{ run }} />,
    );
    document.body.appendChild(container);
    const recover = vi.fn();
    const view = render(<GenerativeUI document={declaration} actions={{ run }} />, {
      container,
      hydrate: true,
      onRecoverableError: recover,
    });
    await act(async () => undefined);
    expect(recover).not.toHaveBeenCalled();
    const first = screen.getByRole('tab', { name: 'First' });
    expect(first).toHaveAttribute(
      'aria-controls',
      screen.getByRole('tabpanel', { name: 'First' }).id,
    );
    view.unmount();
    container.remove();
  });

  it('reports host vetoes and clears the diagnostic after recovery', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const lease = registry.constrain(['tab'], () => ({
      success: false,
      issues: [{ path: 'tab', message: 'Host selection policy veto.' }],
    }));
    expect(lease.success).toBe(false);
    let blocked = false;
    const restriction = registry.constrain(['tab'], () =>
      blocked
        ? {
            success: false,
            issues: [{ path: 'tab', message: 'Host selection policy veto.' }],
          }
        : { success: true, data: undefined },
    );
    if (!restriction.success) throw new Error('Expected host constraint.');
    render(
      <GenerativeUI
        document={declaration}
        registry={registry}
        actions={{ run: vi.fn() }}
      />,
    );
    blocked = true;
    await user.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Host selection policy veto.');
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    restriction.data();
    await user.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
