import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ReacdRenderer, templates } from '../../../index.js';
import type { ActionHandlers, ReacdNode, TemplateRegistry } from '../../../index.js';
import { createExample } from '../../../../tooling/conformance/example.js';
import { documentWith } from '../../../../test-support/documents.js';

describe('Generative rendering: layout', () => {
  it('renders all layout primitives, semantic roles and text weights', () => {
    const nodes: ReacdNode[] = [
      { type: 'Text', content: 'Headline', role: 'headline', weight: 'bold' },
      { type: 'Text', content: 'Subheadline', role: 'subheadline', weight: 'medium' },
      { type: 'Text', content: 'Default body', weight: 'normal' },
      { type: 'Text', content: 'Caption', role: 'caption' },
      { type: 'Text', content: '123', role: 'display' },
      {
        type: 'Grid',
        columns: 3,
        spacing: 'large',
        children: [
          { type: 'Card', children: [{ type: 'Text', content: 'Grid card' }] },
        ],
      },
      {
        type: 'HStack',
        spacing: 'small',
        children: [{ type: 'Text', content: 'Horizontal item' }],
      },
    ];
    render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({ type: 'VStack', children: nodes })}
        actions={{}}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Headline' }).className,
    ).toContain('font-bold');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Subheadline' }).className,
    ).toContain('font-medium');
    expect(screen.getByText('Default body').className).toContain('font-normal');
    expect(screen.getByText('Caption').className).toContain('text-sm');
    expect(screen.getByText('123').className).toContain('text-4xl');
    const card = screen.getByText('Grid card').closest('.bg-card');
    expect(card?.className).toContain('bg-card');
    expect(card?.parentElement).toHaveStyle('gap: var(--space-large)');
    expect(card?.parentElement?.style.gridTemplateColumns).toContain('/ 3');
    expect(screen.getByText('Default body').parentElement).toHaveStyle(
      'gap: var(--space-medium)',
    );
    expect(screen.getByText('Horizontal item').parentElement).toHaveStyle(
      'gap: var(--space-small)',
    );
  });

  it('makes clamped text accessible through a native disclosure', async () => {
    const user = userEvent.setup();
    render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({ type: 'Text', content: 'Long heading', lineLimit: 1 })}
        actions={{}}
      />,
    );
    const summary = screen.getByRole('button', { name: 'Full text' });
    expect(screen.getAllByText('Long heading')).toHaveLength(1);
    expect(screen.getAllByText('Long heading')[0]).toHaveStyle('-webkit-line-clamp: 1');
    await user.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByText('Long heading')).toHaveLength(2);
    await user.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByText('Long heading')).toHaveLength(1);
  });

  it('escapes markup and never executes document content', () => {
    const { container } = render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({
          type: 'Text',
          content: '<script>alert(1)</script><img src=x>',
        })}
        actions={{}}
      />,
    );
    expect(container.querySelector('script, img')).toBeNull();
    expect(
      screen.getByText('<script>alert(1)</script><img src=x>'),
    ).toBeInTheDocument();
  });

  it('renders button intents, password inputs, and disabled controls', async () => {
    const user = userEvent.setup();
    const save = vi.fn<ActionHandlers[string]>();
    render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({
          type: 'VStack',
          children: [
            {
              type: 'Input',
              id: 'secret',
              label: 'Password',
              inputType: 'password',
              disabled: true,
            },
            {
              type: 'Button',
              label: 'Disabled',
              action: 'save',
              disabled: true,
              intent: 'secondary',
            },
            { type: 'Button', label: 'Delete', action: 'save', intent: 'danger' },
          ],
        })}
        actions={{ save }}
      />,
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Disabled' }).className).toContain(
      'bg-secondary',
    );
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain(
      'bg-destructive',
    );
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(save).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(save).toHaveBeenCalledOnce();
  });

  it('reports invalid documents, templates, and tokens', () => {
    const { rerender } = render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={{ root: { type: 'div' } }}
        actions={{}}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to render this interface',
    );
    const document = documentWith({ type: 'Text', content: 'Safe' });
    for (const templateId of ['missing', 'toString']) {
      rerender(
        <ReacdRenderer
          adapter={shadcnAdapter}
          document={document}
          actions={{}}
          templateId={templateId}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent(
        `Template is not registered: ${templateId}`,
      );
    }
    const custom: TemplateRegistry = {
      custom: { ...templates['erp-compact'], radius: -1 },
    };
    rerender(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={document}
        actions={{}}
        templateId="custom"
        templates={custom}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('ReacdProvider.templates');
  });

  it('accepts custom tokens without exposing styling props', () => {
    const document = documentWith({ type: 'Text', content: 'Custom' });
    const original = JSON.stringify(document);
    const custom = { ...templates['saas-modern-light'], name: 'Custom', radius: 0.4 };
    const { container } = render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={document}
        actions={{}}
        templateId="custom"
        templates={{ custom }}
      />,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(container.querySelector('[data-adapter="shadcn-ui"]')).toHaveStyle(
      '--radius: 0.4rem',
    );
    expect(JSON.stringify(document)).toBe(original);
  });

  it('renders without a browser during server-side rendering', () => {
    const html = renderToString(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={createExample('standard')}
        actions={{ 'save-note': () => undefined }}
      />,
    );
    expect(html).toContain('Order overview');
    expect(html).toContain('data-template="saas-modern-light"');
  });
});
