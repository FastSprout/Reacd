import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'visible', kind: 'boolean', access: 'readWrite', initial: true }],
  root: {
    type: 'VStack',
    children: [
      { type: 'User', name: 'Ada Lovelace', action: 'openProfile' },
      {
        type: 'ProgressGroup',
        label: 'Capacity',
        items: [{ id: 'apps', label: 'Applications', value: 24 }],
      },
      {
        type: 'Banner',
        title: 'Maintenance',
        dismissible: true,
        open: { state: 'visible', mode: 'readWrite' },
        actions: [{ type: 'Button', label: 'Save work', action: 'save' }],
      },
      {
        type: 'Toggle',
        label: 'Show notice',
        checked: { state: 'visible', mode: 'readWrite' },
      },
    ],
  },
});

describe('public generative feedback integration', () => {
  it('resolves actions and preserves controlled visibility', async () => {
    const user = userEvent.setup();
    const openProfile = vi.fn();
    const save = vi.fn();
    const registry = createDocumentState(declaration);
    const actions = { openProfile, save };
    const view = render(
      <GenerativeUI document={declaration} registry={registry} actions={actions} />,
    );
    expect(screen.getByRole('progressbar', { name: 'Capacity' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );
    await user.click(screen.getByRole('button', { name: 'Ada Lovelace' }));
    await user.click(screen.getByRole('button', { name: 'Save work' }));
    expect(openProfile).toHaveBeenCalledWith({ state: registry });
    expect(save).toHaveBeenCalledWith({ state: registry });
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(screen.queryByRole('status')).toBeNull();
    view.rerender(
      <GenerativeUI
        document={declaration}
        registry={registry}
        actions={actions}
        templateId="erp-compact"
      />,
    );
    expect(screen.queryByRole('status')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Show notice' }));
    expect(screen.getByRole('status', { name: 'Maintenance' })).toBeInTheDocument();
  });
  it('checks registered actions inside banners and user identity declarations', () => {
    const view = render(<GenerativeUI document={declaration} actions={{}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('openProfile');
    view.rerender(
      <GenerativeUI
        document={declaration}
        actions={{ openProfile: () => undefined }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('save');
    expect(screen.queryByRole('button')).toBeNull();
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [{ key: 'visible', kind: 'boolean', access: 'read', initial: true }],
      }).success,
    ).toBe(false);
  });
  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates generative feedback and isolates the next request in %s',
    async (templateId) => {
      const user = userEvent.setup();
      const actions = { openProfile: vi.fn(), save: vi.fn() };
      const content = (
        <GenerativeUI
          document={declaration}
          actions={actions}
          templateId={templateId}
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
      await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
      expect(screen.queryByRole('status')).toBeNull();
      expect(renderToString(content)).toContain('Maintenance');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
