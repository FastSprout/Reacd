import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { BoundTree } from './bound-tree.js';
import { treeNodeSchema } from '../../schema/tree/generative.schema.js';
import { treeSchema } from '../../schema/tree/index.js';
import { RenderContext } from '../../components/shared/port.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';

const items = [{ id: 'folder', label: 'Folder', children: [
  { id: 'alpha', label: 'Alpha' }, { id: 'beta', label: 'Beta' },
] }];
function declaration(mode: 'read' | 'readWrite' = 'readWrite') {
  return defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      { key: 'selected', kind: 'selection', initial: [], access: 'readWrite' },
      { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
    ],
    root: { type: 'Tree', label: 'Files', items,
      value: { state: 'selected', mode }, expanded: { state: 'expanded', mode } },
  });
}
function headless(document: ReturnType<typeof declaration>, registry: StateRegistry,
  probe: ReturnType<typeof exampleDeclarationProbe>, templateId = 'saas-modern-light') {
  return <ReacdProvider adapter={shadcnAdapter} store={registry.store}
    templateId={templateId}>
    <RenderContext value={probe.port}>
      <BoundTree node={treeNodeSchema.parse(document.root)} registry={registry} />
    </RenderContext>
  </ReacdProvider>;
}
describe('generative tree state', () => {
  it('reports the exact unsupported native Tree boundary', () => {
    expectUnsupportedExample(<GenerativeUI adapter={shadcnAdapter}
      document={declaration()} />, 'Tree');
  });
  it('binds state keys and constrains ids and counts across native themes', () => {
    const document = declaration();
    const registry = createDocumentState(document);
    const probe = exampleDeclarationProbe();
    const view = render(headless(document, registry, probe));
    act(() => {
      probe.read('Tree', treeSchema).onExpandedChange(['folder']);
      probe.read('Tree', treeSchema).onValueChange(['alpha']);
    });
    expect(registry.read('selected')).toEqual({ success: true,
      data: { key: 'selected', kind: 'selection', value: ['alpha'] } });
    expect(success(registry.read('expanded')).value).toEqual(['folder']);
    expect(registry.update('selected', ['unknown']).success).toBe(false);
    expect(registry.update('selected', ['alpha', 'beta']).success).toBe(false);
    expect(registry.update('expanded', ['alpha']).success).toBe(false);
    view.rerender(headless(document, registry, probe, 'erp-compact'));
    expect(probe.read('Tree', treeSchema).value).toEqual(['alpha']);
    expect(probe.read('Tree', treeSchema).expanded).toEqual(['folder']);
    expect(createDocumentState(document).read('selected')).toEqual({ success: true,
      data: { key: 'selected', kind: 'selection', value: [] } });
  });
  it('forwards reader protection and rejects selection and expansion writes', () => {
    const document = declaration('read');
    const registry = createDocumentState(document);
    const probe = exampleDeclarationProbe();
    render(headless(document, registry, probe));
    const tree = probe.read('Tree', treeSchema);
    expect(tree.selectionReadOnly).toBe(true);
    expect(tree.expansionReadOnly).toBe(true);
    act(() => {
      tree.onValueChange(['folder']);
      tree.onExpandedChange(['folder']);
    });
    expect(success(registry.read('selected')).value).toEqual([]);
    expect(success(registry.read('expanded')).value).toEqual([]);
    expect(probe.read('Tree', treeSchema).value).toEqual([]);
  });
  it('rejects bad initial state and unavailable live bindings', () => {
    const document = declaration();
    for (const initial of [['unknown'], ['alpha', 'beta']])
      expect(validateGenerativeDocument({ ...document, state: [
        { key: 'selected', kind: 'selection', initial, access: 'readWrite' },
        { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
      ] }).success).toBe(false);
    const node = treeNodeSchema.parse(document.root);
    const registry = createDocumentState(document);
    const view = render(<ReacdProvider adapter={shadcnAdapter}>
      <BoundTree node={{ ...node, value: { state: 'missing', mode: 'readWrite' } }}
        registry={registry} />
    </ReacdProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent('missing');
    view.rerender(<ReacdProvider adapter={shadcnAdapter}>
      <BoundTree node={{ ...node, expanded: { state: 'missing', mode: 'readWrite' } }}
        registry={registry} />
    </ReacdProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent('missing');
  });
  it.each(['saas-modern-light', 'erp-compact'])(
    'hydrates headless state in %s with isolated server requests', (templateId) => {
      const document = declaration();
      const serverRegistry = createDocumentState(document);
      const serverProbe = exampleDeclarationProbe();
      const server = headless(document, serverRegistry, serverProbe, templateId);
      const html = renderToString(server);
      const container = window.document.createElement('div');
      container.innerHTML = html;
      window.document.body.appendChild(container);
      const registry = createDocumentState(document);
      const probe = exampleDeclarationProbe();
      const errors: unknown[] = [];
      const view = render(headless(document, registry, probe, templateId), {
        container, hydrate: true,
        onRecoverableError: (error) => errors.push(error),
      });
      act(() => { probe.read('Tree', treeSchema).onExpandedChange(['folder']); });
      expect(probe.read('Tree', treeSchema).expanded).toEqual(['folder']);
      expect(success(registry.read('expanded')).value).toEqual(['folder']);
      expect(success(serverRegistry.read('expanded')).value).toEqual([]);
      expect(renderToString(server)).toBe(html);
      expect(screen.queryByRole('tree')).toBeNull();
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});
