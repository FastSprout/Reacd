import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundHeader } from './bound-header.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'menu', kind: 'boolean', initial: false, access: 'readWrite' }],
  root: {
    type: 'Main',
    children: [
      {
        type: 'Container',
        children: [
          {
            type: 'Header',
            title: 'Generated header',
            href: '/',
            children: [{ type: 'Text', content: 'Navigation center' }],
            start: [{ type: 'Text', content: 'Navigation start' }],
            end: [{ type: 'Text', content: 'Navigation end' }],
            top: [{ type: 'Text', content: 'Navigation top' }],
            bottom: [{ type: 'Text', content: 'Navigation bottom' }],
            menu: {
              open: { state: 'menu', mode: 'readWrite' },
              content: [{ type: 'Button', label: 'Navigate locally', action: 'go' }],
            },
          },
          { type: 'Header', title: 'Secondary header', children: [] },
          { type: 'Separator', children: [{ type: 'Text', content: 'Boundary' }] },
          {
            type: 'Footer',
            children: [{ type: 'Text', content: 'Footer center' }],
            start: [{ type: 'Text', content: 'Footer start' }],
            end: [{ type: 'Text', content: 'Footer end' }],
            top: [{ type: 'Text', content: 'Footer top' }],
            bottom: [{ type: 'Text', content: 'Footer bottom' }],
          },
        ],
      },
    ],
  },
});

describe('generative structural shells', () => {
  it('uses shared writable menu state and safe menu actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const go = vi.fn();
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{ go }}
      />,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByText('Footer bottom')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(success(registry.read('menu')).value).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Navigate locally' }));
    expect(go).toHaveBeenCalledOnce();
    await user.keyboard('{Escape}');
    expect(success(registry.read('menu')).value).toBe(false);
  });

  it('validates actions in every shell slot before rendering', () => {
    for (const type of ['Header', 'Footer']) {
      for (const slot of ['children', 'start', 'end', 'top', 'bottom']) {
        const document = {
          ...declaration,
          root: {
            type,
            ...(type === 'Header' ? { title: 'App' } : {}),
            children: [],
            [slot]: [{ type: 'Button', label: 'Missing', action: 'missing' }],
          },
        };
        const view = render(
          <GenerativeUI adapter={shadcnAdapter} document={document} />,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('missing');
        view.unmount();
      }
    }
    render(<GenerativeUI adapter={shadcnAdapter} document={declaration} />);
    expect(screen.getByRole('alert')).toHaveTextContent('go');
  });

  it('fails closed for incompatible and missing live menu bindings', () => {
    expect(
      validateGenerativeDocument({
        ...declaration,
        state: [{ key: 'menu', kind: 'text', initial: '', access: 'readWrite' }],
      }).success,
    ).toBe(false);
    render(
      <BoundHeader
        properties={{ title: 'Missing' }}
        content={null}
        menu={{ content: [], open: { state: 'missing', mode: 'readWrite' } }}
        registry={success(createStateRegistry([]))}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });

  it('server-renders shell content without opening a closed portal', () => {
    const output = renderToStaticMarkup(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        actions={{ go: () => undefined }}
      />,
    );
    expect(output).toContain('Generated header');
    expect(output).toContain('Footer center');
    expect(output).not.toContain('Navigate locally');
  });
});
