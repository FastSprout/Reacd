import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { createDocumentState } from './create-document-state.js';
import { BoundListbox } from './bound-listbox.js';
import { listboxSchema, listboxNodeSchema } from '../../schema/listbox/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { ListboxNode } from '../../schema/listbox/index.js';
import { ReacdProvider } from '../provider/provider.js';
import { RenderContext } from '../../components/shared/port.js';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';

const documentSpec = {
  schemaVersion: '0.2',
  state: [{ key: 'choice', kind: 'text', initial: '42', access: 'readWrite' }],
  root: {
    type: 'Listbox',
    label: 'First',
    required: true,
    items: [
      { value: '42', label: 'Answer' },
      { value: 'b', label: 'Beta' },
    ],
    value: { state: 'choice', mode: 'readWrite' },
  },
} as const;

it('validates transport kinds, closed props and required empty values', () => {
  expect(validateGenerativeDocument(documentSpec).success).toBe(true);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      state: [{ ...documentSpec.state[0], initial: '' }],
    }).success,
  ).toBe(true);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, mode: 'multiple' },
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, value: { state: 'missing', mode: 'read' } },
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, className: 'unsafe' },
    }).success,
  ).toBe(false);
});

it('reports the exact unsupported native Listbox transport boundary', () => {
  expectUnsupportedExample(<GenerativeUI adapter={shadcnAdapter}
    document={documentSpec} />, 'Listbox');
});

function state() {
  const parsed = validateGenerativeDocument(documentSpec);
  if (!parsed.success) throw new Error('Invalid Listbox fixture');
  return createDocumentState(parsed.data);
}
function bound(registry: StateRegistry, node: ListboxNode,
  probe: ReturnType<typeof exampleDeclarationProbe>) {
  return <ReacdProvider adapter={shadcnAdapter} store={registry.store}>
    <RenderContext value={probe.port}>
      <BoundListbox node={node} registry={registry} />
    </RenderContext>
  </ReacdProvider>;
}
it('hydrates headless declarations with isolated client and SSR registries', () => {
  const first = listboxNodeSchema.parse(documentSpec.root);
  const second = { ...first, label: 'Second' };
  const serverFirst = state();
  const serverSecond = state();
  const serverProbe = exampleDeclarationProbe();
  const container = document.createElement('div');
  container.innerHTML = renderToString(<>
    {bound(serverFirst, first, serverProbe)}
    {bound(serverSecond, second, serverProbe)}
  </>);
  document.body.append(container);
  const clientFirst = state();
  const clientSecond = state();
  const probe = exampleDeclarationProbe();
  const errors: unknown[] = [];
  const view = render(<>
    {bound(clientFirst, first, probe)}
    {bound(clientSecond, second, probe)}
  </>, { container, hydrate: true,
    onRecoverableError: (error) => errors.push(error) });
  act(() => {
    expect(probe.read('Listbox', listboxSchema.options[0], 'First')
      .onValueChange('b')).toBe(true);
  });
  expect(probe.read('Listbox', listboxSchema.options[0], 'First').value).toBe('b');
  expect(probe.read('Listbox', listboxSchema.options[0], 'Second').value).toBe('42');
  expect(success(clientFirst.read('choice')).value).toBe('b');
  for (const registry of [clientSecond, serverFirst, serverSecond])
    expect(success(registry.read('choice')).value).toBe('42');
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
