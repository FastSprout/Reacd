import { act, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { EditorDocument } from '../../core/editor-document.js';
import { editorSchema } from '../../schema/editor/index.js';
import { editorDragHandleSchema } from '../../schema/editor-drag-handle/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { RenderContext } from '../../components/shared/port.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { GenerativeNodeView } from './node-view.js';
import { GenerativeUI } from './generative-ui.js';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
    { type: 'paragraph', id: 'second', content: [{ type: 'text', text: 'Second' }] },
  ],
};
const MOVED: EditorDocument = { version: 1, blocks: [...INITIAL.blocks].reverse() };
const DEFINITIONS = [
  { key: 'draft', kind: 'richDocument', access: 'readWrite', initial: INITIAL },
];
function editor(label: string, mode: 'read' | 'readWrite') {
  return {
    type: 'Editor', label, value: { state: 'draft', mode },
    toolbar: [
      { type: 'EditorDragHandle', label: `${label} blocks`, blockId: 'second' },
    ],
  };
}
const documentModel = {
  schemaVersion: '0.2', state: DEFINITIONS,
  root: { type: 'VStack', children: [editor('Writer', 'readWrite'),
    editor('Reader', 'read')] },
};

it('exposes exact native Editor and DragHandle capability boundaries', () => {
  expectUnsupportedExample(<GenerativeUI document={documentModel} />, 'Editor');
  expectUnsupportedExample(<GenerativeUI document={{ ...documentModel,
    root: { type: 'EditorDragHandle', label: 'Block actions', blockId: 'second' },
  }} />, 'EditorDragHandle');
});

it('routes atomic block-order proposals while protecting readers and isolation', () => {
  const registry = success(createStateRegistry(DEFINITIONS));
  const isolated = success(createStateRegistry(DEFINITIONS));
  const notify = vi.fn();
  const stop = success(registry.subscribe('draft', notify));
  const parsed = success(validateGenerativeDocument(documentModel));
  const probe = exampleDeclarationProbe();
  const view = render(<RenderContext.Provider value={probe.port}>
    <GenerativeNodeView node={parsed.root} registry={registry} actions={{}} />
  </RenderContext.Provider>);
  function properties(label: string) {
    const value = probe.read('Editor', editorSchema, label);
    if (!('onValueChange' in value)) throw new Error('Expected document binding.');
    return value;
  }
  try {
    for (const label of ['Writer', 'Reader']) {
      expect(probe.read('EditorDragHandle', editorDragHandleSchema,
        `${label} blocks`).blockId).toBe('second');
    }
    expect(properties('Reader').readOnly).toBe(true);
    expect(notify).not.toHaveBeenCalled();
    act(() => properties('Reader').onValueChange(MOVED));
    expect(notify).not.toHaveBeenCalled();
    act(() => properties('Writer').onValueChange(MOVED));
    expect(properties('Reader').value).toEqual(MOVED);
    expect(properties('Writer').value).toEqual(MOVED);
    expect(success(registry.read('draft')).value).toEqual(MOVED);
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      key: 'draft', kind: 'richDocument', value: MOVED,
    });
    expect(success(isolated.read('draft')).value).toEqual(INITIAL);
    act(() => { expect(registry.update('draft', INITIAL).success).toBe(true); });
    expect(properties('Reader').value).toEqual(INITIAL);
    expect(properties('Writer').value).toEqual(INITIAL);
    expect(notify).toHaveBeenCalledTimes(2);
  } finally {
    view.unmount();
    stop();
  }
});
