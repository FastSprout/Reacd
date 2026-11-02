import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import type { EditorDocument } from '../../core/editor-document.js';
import { editorSchema } from '../../schema/editor/index.js';
import { editorToolbarSchema } from '../../schema/editor-toolbar/index.js';
import { editorSuggestionMenuSchema } from
  '../../schema/editor-suggestion-menu/index.js';
import { editorMentionMenuSchema } from '../../schema/editor-mention-menu/index.js';
import { editorEmojiMenuSchema } from '../../schema/editor-emoji-menu/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { RenderContext } from '../../components/shared/port.js';
import { buttonComponentSchema } from '../../schema/button/button.schema.js';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { GenerativeUI } from './generative-ui.js';
import { GenerativeNodeView } from './node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import type { StateRegistry } from '../registry/registry.types.js';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro',
    content: [{ type: 'text', text: 'Initial draft' }] }],
};
const EDITED: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro',
    content: [{ type: 'text', text: 'Initial draft!', marks: ['bold'] }] }],
};
const HOST: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'host-note',
    content: [{ type: 'text', text: 'Host replacement.' }] }],
};
const DEFINITIONS = [
  { key: 'notes', kind: 'richDocument', access: 'readWrite', initial: INITIAL },
];

function editor(label: string, mode: 'read' | 'readWrite' = 'readWrite',
  flags: { readOnly?: boolean; disabled?: boolean } = {}) {
  return {
    type: 'Editor', label, ...flags, value: { state: 'notes', mode },
    toolbar: [{ type: 'EditorToolbar', label: `${label} formatting`,
      items: [{ command: 'bold' }, { command: 'undo' }] }],
    children: [{ type: 'Text', content: `${label} help` }],
  };
}
function model(children: readonly unknown[] = [editor('Writer'), editor('Reader',
  'read')]) {
  return { schemaVersion: '0.2', state: DEFINITIONS,
    root: { type: 'VStack', children } };
}
function projection(registry: StateRegistry,
  probe: ReturnType<typeof exampleDeclarationProbe>, input: unknown = model()) {
  const document = success(validateGenerativeDocument(input));
  return <RenderContext.Provider value={probe.port}>
    <GenerativeNodeView node={document.root} registry={registry} actions={{}} />
  </RenderContext.Provider>;
}
function writer(probe: ReturnType<typeof exampleDeclarationProbe>, label = 'Writer') {
  const properties = probe.read('Editor', editorSchema, label);
  if (!('onValueChange' in properties)) throw new Error('Expected document binding.');
  return properties;
}

it('rejects the actual native Editor boundary without mutating registered state',
  () => {
    const registry = success(createStateRegistry(DEFINITIONS));
    expectUnsupportedExample(<GenerativeUI document={model()}
      registry={registry} />, 'Editor');
    expect(success(registry.read('notes')).value).toEqual(INITIAL);
  });

it('projects atomic document writes, toolbar data and quiet host replacements', () => {
  const first = success(createStateRegistry(DEFINITIONS));
  const other = success(createStateRegistry(DEFINITIONS));
  const notify = vi.fn();
  const unsubscribe = success(first.subscribe('notes', notify));
  const probe = exampleDeclarationProbe();
  const view = render(projection(first, probe));
  try {
    expect(writer(probe).value).toEqual(INITIAL);
    expect(writer(probe, 'Reader').readOnly).toBe(true);
    expect(probe.texts()).toContain('Writer help');
    expect(probe.read('EditorToolbar', editorToolbarSchema, 'Writer formatting')
      .items).toEqual([{ command: 'bold' }, { command: 'undo' }]);
    expect(notify).not.toHaveBeenCalled();
    act(() => writer(probe).onValueChange(EDITED));
    expect(writer(probe, 'Reader').value).toEqual(EDITED);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      key: 'notes', kind: 'richDocument', value: EDITED,
    });
    act(() => writer(probe).onValueChange({ version: 1, blocks: [] }));
    expect(notify).toHaveBeenCalledTimes(1);
    expect(success(first.read('notes')).value).toEqual(EDITED);
    act(() => { expect(first.update('notes', HOST).success).toBe(true); });
    expect(writer(probe).value).toEqual(HOST);
    expect(writer(probe, 'Reader').value).toEqual(HOST);
    expect(notify).toHaveBeenCalledTimes(2);
    expect(success(other.read('notes')).value).toEqual(INITIAL);
    expect(first.update('notes', '<p>Unsafe</p>').success).toBe(false);
    expect(notify).toHaveBeenCalledTimes(2);
  } finally {
    view.unmount();
    unsubscribe();
  }
});

it('protects readonly, disabled and read bindings while receiving host updates', () => {
  const state = success(createStateRegistry(DEFINITIONS));
  const probe = exampleDeclarationProbe();
  const notify = vi.fn();
  const unsubscribe = success(state.subscribe('notes', notify));
  const view = render(projection(state, probe, model([
    editor('Literal reader', 'readWrite', { readOnly: true }),
    editor('Disabled', 'readWrite', { disabled: true }),
    editor('Binding reader', 'read', { readOnly: false }),
  ])));
  try {
    for (const label of ['Literal reader', 'Disabled', 'Binding reader']) {
      act(() => writer(probe, label).onValueChange(EDITED));
      expect(writer(probe, label).value).toEqual(INITIAL);
    }
    expect(writer(probe, 'Literal reader').readOnly).toBe(true);
    expect(writer(probe, 'Binding reader').readOnly).toBe(true);
    expect(writer(probe, 'Disabled').disabled).toBe(true);
    expect(notify).not.toHaveBeenCalled();
    act(() => { expect(state.update('notes', HOST).success).toBe(true); });
    expect(writer(probe, 'Disabled').value).toEqual(HOST);
    expect(notify).toHaveBeenCalledTimes(1);
  } finally {
    view.unmount();
    unsubscribe();
  }
});

it('hydrates headless declarations without publishing across isolated requests', () => {
  const server = success(createStateRegistry(DEFINITIONS));
  const client = success(createStateRegistry(DEFINITIONS));
  const serverNotify = vi.fn();
  const clientNotify = vi.fn();
  const stopServer = success(server.subscribe('notes', serverNotify));
  const stopClient = success(client.subscribe('notes', clientNotify));
  const serverProbe = exampleDeclarationProbe();
  const clientProbe = exampleDeclarationProbe();
  const markup = renderToString(projection(server, serverProbe));
  expect(markup).toContain('Writer help');
  expect(markup).not.toContain('contenteditable');
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(projection(client, clientProbe), { container, hydrate: true,
    onRecoverableError: error => errors.push(error) });
  try {
    expect(writer(clientProbe).value).toEqual(INITIAL);
    expect(serverNotify).not.toHaveBeenCalled();
    expect(clientNotify).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
    act(() => writer(clientProbe).onValueChange(EDITED));
    expect(clientNotify).toHaveBeenCalledExactlyOnceWith({
      key: 'notes', kind: 'richDocument', value: EDITED,
    });
    expect(success(server.read('notes')).value).toEqual(INITIAL);
    expect(serverNotify).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
    stopServer();
    stopClient();
  }
});

it('preserves all menu payloads without claiming unavailable native insertion', () => {
  const state = success(createStateRegistry(DEFINITIONS));
  const probe = exampleDeclarationProbe();
  const declaration = { ...editor('Menus'), children: [
    { type: 'EditorSuggestionMenu', label: 'Blocks',
      items: [{ command: 'heading2', label: 'Heading 2' }] },
    { type: 'EditorMentionMenu', label: 'People',
      items: [{ id: 'person', label: 'Example person' }] },
    { type: 'EditorEmojiMenu', label: 'Emoji',
      items: [{ name: 'wave', value: '👋', label: 'Wave' }] },
  ] };
  render(projection(state, probe, model([declaration])));
  expect(probe.read('EditorSuggestionMenu', editorSuggestionMenuSchema, 'Blocks')
    .items).toEqual(declaration.children[0]?.items);
  const mentions = probe.read('EditorMentionMenu', editorMentionMenuSchema, 'People');
  expect('items' in mentions && mentions.items).toEqual(declaration.children[1]?.items);
  expect(probe.read('EditorEmojiMenu', editorEmojiMenuSchema, 'Emoji')
    .items).toEqual(declaration.children[2]?.items);
  expect(success(state.read('notes')).value).toEqual(INITIAL);
});

it('requires registered actions before the SDK boundary and routes captured actions',
  () => {
    const state = success(createStateRegistry(DEFINITIONS));
    const documentModel = model([editor('Writer'),
      { type: 'Button', label: 'Publish', action: 'publish' }]);
    const view = render(<GenerativeUI document={documentModel} registry={state} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Action is not registered: publish.',
    );
    view.unmount();
    const publish = vi.fn();
    const probe = exampleDeclarationProbe();
    const parsed = success(validateGenerativeDocument(documentModel));
    render(<RenderContext.Provider value={probe.port}>
      <GenerativeNodeView node={parsed.root} registry={state}
        actions={{ publish }} />
    </RenderContext.Provider>);
    act(() => probe.read('Button', buttonComponentSchema, 'Publish').onPress());
    expect(publish).toHaveBeenCalledExactlyOnceWith({ state });
  });
