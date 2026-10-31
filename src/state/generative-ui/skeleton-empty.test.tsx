import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundEmpty } from './bound-empty.js';
import { BoundSkeleton } from './bound-skeleton.js';

const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'busy', kind: 'boolean', initial: true, access: 'read' }],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Skeleton',
        label: 'Loading query',
        show: { state: 'busy', mode: 'read' },
      },
      { type: 'Skeleton', shape: 'avatar', show: true },
      {
        type: 'Empty',
        title: 'No query matches',
        loading: { state: 'busy', mode: 'read' },
        leading: [{ type: 'Avatar', name: 'Local query' }],
        children: [{ type: 'Text', content: 'Change the search query.' }],
        actions: [{ type: 'Button', label: 'Refresh query', action: 'refresh' }],
        footer: [{ type: 'Button', label: 'Query help', action: 'help' }],
      },
      { type: 'Empty', title: 'Minimal empty', children: [] },
    ],
  },
});
describe('generative loading and empty states', () => {
  it('shares read-only busy state and runs safe slot actions', async () => {
    const user = userEvent.setup();
    const registry = createDocumentState(declaration);
    const help = vi.fn();
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
        actions={{
          refresh: ({ state }) => {
            state.update('busy', false);
          },
          help,
        }}
      />,
    );
    expect(screen.getByRole('status', { name: 'Loading query' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'No query matches' })).toHaveAttribute(
      'data-loading',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'Refresh query' }));
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('region', { name: 'No query matches' })).toHaveAttribute(
      'data-loading',
      'false',
    );
    await user.click(screen.getByRole('button', { name: 'Query help' }));
    expect(help).toHaveBeenCalledOnce();
    act(() => {
      expect(registry.update('busy', 'Invalid').success).toBe(false);
    });
    expect(registry.read('busy')).toMatchObject({
      success: true,
      data: { value: false },
    });
  });
  it('validates every nested slot, missing references and read permissions', () => {
    for (const property of ['leading', 'children', 'actions', 'footer']) {
      const document = {
        ...declaration,
        root: {
          type: 'Empty',
          title: 'Invalid action',
          children: [],
          [property]: [{ type: 'Button', label: 'Missing', action: 'missing' }],
        },
      };
      const view = render(<GenerativeUI adapter={shadcnAdapter} document={document} />);
      expect(screen.getByRole('alert')).toHaveTextContent('missing');
      view.unmount();
    }
    for (const root of [
      { type: 'Skeleton', show: { state: 'busy', mode: 'readWrite' } },
      { type: 'Skeleton', show: { state: 'missing', mode: 'read' } },
      {
        type: 'Empty',
        title: 'Invalid',
        children: [],
        loading: { state: 'busy', mode: 'readWrite' },
      },
      {
        type: 'Empty',
        title: 'Invalid',
        children: [],
        loading: { state: 'missing', mode: 'read' },
      },
      { type: 'Skeleton', shape: 'avatar', lines: 2 },
    ])
      expect(validateGenerativeDocument({ ...declaration, root }).success).toBe(false);
  });
  it('fails closed when live readers cannot resolve a binding', () => {
    const registry = createDocumentState(
      defineGenerativeDeclaration({
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'None' },
      }),
    );
    const reference = { state: 'missing', mode: 'read' } as const;
    const view = render(
      <BoundSkeleton registry={registry} reference={reference} properties={{}} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
    view.rerender(
      <BoundEmpty
        registry={registry}
        reference={reference}
        properties={{ title: 'Missing state' }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
});
