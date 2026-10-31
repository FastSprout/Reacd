import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundCommandPalette } from './bound-command-palette.js';

const command = { key: 'guide', label: 'Guide command', action: 'run' };
const node = {
  type: 'CommandPalette' as const,
  label: 'Find an action',
  query: { state: 'query', mode: 'readWrite' as const },
  selection: { state: 'selected', mode: 'readWrite' as const },
  groups: [
    {
      key: 'docs',
      label: 'Documentation',
      items: [
        { key: 'guide', label: 'Guide command', action: 'run' },
        { key: 'home', label: 'Home command', href: '/' },
        { key: 'callback', label: 'Selection only' },
      ],
    },
  ],
};
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
    { key: 'selected', kind: 'text', initial: '', access: 'readWrite' },
  ],
  root: node,
});

describe('generative CommandPalette', () => {
  it('binds query and accepted selections before running named actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const action = vi.fn(() => {
      expect(registry.read('selected')).toEqual({
        success: true,
        data: { key: 'selected', kind: 'text', value: 'guide' },
      });
    });
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{ run: action }}
      />,
    );
    await user.type(screen.getByRole('combobox'), 'guide');
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    expect(action).toHaveBeenCalledOnce();
    expect(registry.update('selected', 'unknown').success).toBe(false);
    expect(screen.getByRole('combobox')).toHaveValue('guide');
  });

  it('vetoes rejected selection and query writes, then recovers', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const lease = registry.constrain(['selected', 'query'], (read) => {
      const selected = read('selected');
      const query = read('query');
      if (!selected.success) return selected;
      if (!query.success) return query;
      return selected.data.value !== '' || query.data.value !== ''
        ? { success: false, issues: [{ path: '$', message: 'Changes are blocked.' }] }
        : { success: true, data: undefined };
    });
    if (!lease.success) throw new Error('Constraint registration failed.');
    const action = vi.fn();
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{ run: action }}
      />,
    );
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    expect(action).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Changes are blocked.');
    await user.type(screen.getByRole('combobox'), 'g');
    expect(screen.getByRole('combobox')).toHaveValue('');
    act(() => lease.data());
    await user.type(screen.getByRole('combobox'), 'guide');
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('validates action-only palettes before rendering', async () => {
    const user = userEvent.setup();
    const document = defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [{ key: 'query', kind: 'text', initial: '', access: 'readWrite' }],
      root: {
        type: 'CommandPalette',
        label: 'Actions only',
        query: node.query,
        groups: [{ key: 'one', label: 'Commands', items: [command] }],
      },
    });
    const action = vi.fn();
    const view = render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        actions={{ run: action }}
      />,
    );
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    expect(action).toHaveBeenCalledOnce();
    view.rerender(<GenerativeUI adapter={shadcnAdapter} document={document} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [
          { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
          { key: 'selected', kind: 'text', initial: 'missing', access: 'readWrite' },
        ],
      }).success,
    ).toBe(false);
  });

  it('rejects inherited or replaced handlers after validation', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const inherited = vi.fn();
    const actions = { run: action };
    render(
      <GenerativeUI adapter={shadcnAdapter} document={declaration} actions={actions} />,
    );
    Object.defineProperty(actions, 'run', { value: 42, configurable: true });
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    Reflect.deleteProperty(actions, 'run');
    Object.setPrototypeOf(actions, { run: inherited });
    await user.click(screen.getByRole('option', { name: 'Guide command' }));
    expect(inherited).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it.each(['query', 'selection'] as const)(
    'reports a missing live %s binding',
    (property) => {
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <BoundCommandPalette
            node={{ ...node, [property]: { state: 'missing', mode: 'readWrite' } }}
            registry={createDocumentState(declaration)}
            actions={{ run: vi.fn() }}
          />
        </ReacdProvider>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    },
  );

  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates %s and isolates the query between requests',
    async (templateId) => {
      const user = userEvent.setup();
      const content = (
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
          templateId={templateId}
          actions={{ run: vi.fn() }}
        />
      );
      const container = document.createElement('div');
      container.innerHTML = renderToString(content);
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(content, {
        container,
        hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      await user.type(screen.getByRole('combobox'), 'guide');
      expect(screen.getByRole('combobox')).toHaveValue('guide');
      expect(renderToString(content)).not.toContain('value="guide"');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
