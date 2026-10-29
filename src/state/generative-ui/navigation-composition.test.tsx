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
import { BoundStepper } from './bound-stepper.js';
import { generativeNavigationTarget } from './generative-navigation-target.js';

const steps = [
  {
    key: 'address',
    title: 'Address',
    content: [{ type: 'Button' as const, label: 'Address action', action: 'run' }],
  },
  { key: 'payment', title: 'Payment' },
];
const stepNode = {
  type: 'Stepper' as const,
  label: 'Checkout',
  value: { state: 'step', mode: 'readWrite' as const },
  items: steps,
};
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'step', kind: 'text', initial: 'address', access: 'readWrite' }],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'FooterColumns',
        label: 'Footer resources',
        columns: [
          {
            key: 'docs',
            label: 'Docs',
            children: [
              { key: 'link', label: 'Home', href: '/' },
              { key: 'action', label: 'Footer action', action: 'run' },
            ],
          },
        ],
        left: [{ type: 'Text', content: 'Left slot' }],
        right: [{ type: 'Button', label: 'Right slot action', action: 'run' }],
      },
      {
        type: 'NavigationMenu',
        label: 'Application menu',
        items: [
          { key: 'direct', label: 'Direct action', action: 'run' },
          {
            key: 'group',
            label: 'More resources',
            children: [
              { key: 'info', label: 'Information' },
              { key: 'child', label: 'Nested action', action: 'run' },
            ],
          },
        ],
      },
      stepNode,
    ],
  },
});

describe('generative navigation composition', () => {
  it('resolves all nested actions and constrains the controlled step key', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const registry = createDocumentState(declaration);
    render(
      <GenerativeUI
        document={declaration}
        registry={registry}
        actions={{ run: action }}
      />,
    );
    for (const name of [
      'Footer action',
      'Right slot action',
      'Direct action',
      'Address action',
    ]) {
      await user.click(screen.getByRole('button', { name }));
    }
    await user.click(screen.getByRole('button', { name: 'More resources' }));
    await user.click(await screen.findByRole('button', { name: 'Nested action' }));
    expect(action).toHaveBeenCalledTimes(5);
    expect(action).toHaveBeenCalledWith({ state: registry });
    await user.click(screen.getByRole('button', { name: /Payment/ }));
    expect(registry.read('step')).toEqual({
      success: true,
      data: { key: 'step', kind: 'text', value: 'payment' },
    });
    expect(registry.update('step', 'missing').success).toBe(false);
  });

  it('validates inactive content actions before rendering any partial UI', () => {
    render(<GenerativeUI document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [{ key: 'step', kind: 'text', initial: 'missing', access: 'readWrite' }],
      }).success,
    ).toBe(false);
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [{ key: 'step', kind: 'number', initial: 1, access: 'readWrite' }],
      }).success,
    ).toBe(false);
  });

  it('shows read-only state and handles unavailable live bindings', () => {
    const readonly = defineGenerativeDeclaration({
      schemaVersion: '0.2',
      state: [{ key: 'step', kind: 'text', initial: 'address', access: 'read' }],
      root: { ...stepNode, value: { state: 'step', mode: 'read' } },
    });
    const view = render(
      <GenerativeUI document={readonly} actions={{ run: vi.fn() }} />,
    );
    expect(screen.getByRole('button', { name: /Payment/ })).toBeDisabled();
    view.unmount();
    render(
      <ReacdProvider>
        <BoundStepper
          node={{ ...stepNode, value: { state: 'missing', mode: 'readWrite' } }}
          registry={createDocumentState(declaration)}
          renderChild={() => null}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });

  it('reports and recovers from rejected shared transactions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const lease = registry.constrain(['step'], (read) => {
      const current = read('step');
      if (!current.success) return current;
      return current.data.value === 'payment'
        ? {
            success: false,
            issues: [{ path: '$.step', message: 'Payment is blocked.' }],
          }
        : { success: true, data: undefined };
    });
    if (!lease.success) throw new Error('Constraint registration failed.');
    render(
      <GenerativeUI
        document={declaration}
        registry={registry}
        actions={{ run: vi.fn() }}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Payment/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Payment is blocked.');
    const address = screen.getByRole('button', { name: 'Address' });
    expect(address).toHaveAttribute('aria-current', 'step');
    act(() => lease.data());
    await user.click(screen.getByRole('button', { name: /Payment/ }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: /Payment/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('renders empty optional slots and safely resolves missing direct helpers', () => {
    const registry = createDocumentState(declaration);
    expect(
      generativeNavigationTarget({ key: 'info', label: 'Info' }, registry, {}),
    ).toEqual({ key: 'info', label: 'Info', onPress: undefined });
    generativeNavigationTarget(
      { key: 'action', label: 'Action', action: 'missing' },
      registry,
      {},
    ).onPress?.();
    render(
      <GenerativeUI
        document={{
          schemaVersion: '0.2',
          state: [],
          root: {
            type: 'FooterColumns',
            label: 'Empty footer',
            columns: [],
          },
        }}
      />,
    );
    expect(
      screen.getByRole('navigation', { name: 'Empty footer' }),
    ).toBeInTheDocument();
  });

  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates %s without leaking a changed step into the next request',
    async (templateId) => {
      const user = userEvent.setup();
      const content = (
        <GenerativeUI
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
      await user.click(screen.getByRole('button', { name: /Payment/ }));
      expect(screen.getByRole('button', { name: /Payment/ })).toHaveAttribute(
        'aria-current',
        'step',
      );
      expect(renderToString(content)).toContain('Address action');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
