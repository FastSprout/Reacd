import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundTimeline } from './bound-timeline.js';

const items = [
  { id: 'design', title: 'Design' },
  { id: 'build', title: 'Build' },
];
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'step', kind: 'text', initial: 'design', access: 'readWrite' }],
  root: {
    type: 'ScrollArea',
    label: 'Delivery records',
    children: [
      {
        type: 'Timeline',
        label: 'Delivery',
        items,
        value: { state: 'step', mode: 'readWrite' },
      },
      {
        type: 'Timeline',
        label: 'Readonly',
        items: items.map((item) => ({ ...item })),
        value: 'design',
      },
    ],
  },
});
describe('generative Timeline and ScrollArea', () => {
  it('constrains shared current event state and preserves theme changes', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const view = render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Build' }));
    expect(registry.read('step')).toEqual({
      success: true,
      data: { key: 'step', kind: 'text', value: 'build' },
    });
    expect(registry.update('step', 'unknown').success).toBe(false);
    view.rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        templateId="erp-compact"
      />,
    );
    expect(
      screen.getByRole('region', { name: 'Delivery records' }),
    ).toBeInTheDocument();
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [{ key: 'step', kind: 'text', initial: 'unknown', access: 'readWrite' }],
      }).success,
    ).toBe(false);
  });
  it('fails safely for an unavailable live binding', () => {
    const registry = createDocumentState(declaration);
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundTimeline
          properties={{ label: 'Missing', items }}
          reference={{ state: 'unknown', mode: 'readWrite' }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates controlled timelines in %s without leaking into a fresh request',
    async (templateId) => {
      const user = userEvent.setup();
      const content = (
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration}
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
      await user.click(screen.getByRole('button', { name: 'Build' }));
      expect(screen.getAllByRole('listitem')[1]).toHaveAttribute(
        'aria-current',
        'step',
      );
      expect(renderToString(content)).toContain('data-state="current"');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
