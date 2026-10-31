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
import { BoundTree } from './bound-tree.js';
import { treeNodeSchema } from '../../schema/tree/generative.schema.js';

const items = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
    ],
  },
];
function declaration(mode: 'read' | 'readWrite' = 'readWrite') {
  return defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      { key: 'selected', kind: 'selection', initial: [], access: 'readWrite' },
      { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
    ],
    root: {
      type: 'Tree',
      label: 'Files',
      items,
      value: { state: 'selected', mode },
      expanded: { state: 'expanded', mode },
    },
  });
}
describe('generative tree state', () => {
  it('binds state keys and constrains ids and counts', async () => {
    const user = userEvent.setup();
    const document = declaration();
    const registry = createDocumentState(document);
    const view = render(
      <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
    );
    await user.click(screen.getByRole('button', { name: 'Expand Folder' }));
    await user.click(screen.getByRole('treeitem', { name: 'Alpha' }));
    expect(registry.read('selected')).toEqual({
      success: true,
      data: { key: 'selected', kind: 'selection', value: ['alpha'] },
    });
    expect(registry.update('selected', ['unknown']).success).toBe(false);
    expect(registry.update('selected', ['alpha', 'beta']).success).toBe(false);
    expect(registry.update('expanded', ['alpha']).success).toBe(false);
    view.rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={document}
        registry={registry}
        templateId="erp-compact"
      />,
    );
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(createDocumentState(document).read('selected')).toEqual({
      success: true,
      data: { key: 'selected', kind: 'selection', value: [] },
    });
  });
  it('keeps read bindings navigable while disabling their writes', async () => {
    const user = userEvent.setup();
    render(<GenerativeUI adapter={shadcnAdapter} document={declaration('read')} />);
    expect(screen.getByRole('tree')).toHaveAttribute('aria-readonly', 'true');
    expect(screen.getByRole('button', { name: 'Expand Folder' })).toBeDisabled();
    await user.click(screen.getByRole('treeitem', { name: 'Folder' }));
    expect(screen.getByRole('treeitem')).toHaveAttribute('aria-selected', 'false');
  });
  it('rejects bad initial state and unavailable live bindings', () => {
    const document = declaration();
    for (const initial of [['unknown'], ['alpha', 'beta']])
      expect(
        validateGenerativeDocument({
          ...document,
          state: [
            { key: 'selected', kind: 'selection', initial, access: 'readWrite' },
            { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
          ],
        }).success,
      ).toBe(false);
    const node = treeNodeSchema.parse(document.root);
    const registry = createDocumentState(document);
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundTree
          node={{
            ...node,
            value: { state: 'missing', mode: 'readWrite' },
          }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('missing');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundTree
          node={{
            ...node,
            expanded: { state: 'missing', mode: 'readWrite' },
          }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('missing');
  });
  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates tree interactions in %s with isolated request state',
    async (templateId) => {
      const user = userEvent.setup();
      const content = (
        <GenerativeUI
          adapter={shadcnAdapter}
          document={declaration()}
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
      await user.click(screen.getByRole('button', { name: 'Expand Folder' }));
      expect(screen.getByRole('treeitem', { name: 'Alpha' })).toBeInTheDocument();
      expect(renderToString(content)).not.toContain('aria-label="Alpha"');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
