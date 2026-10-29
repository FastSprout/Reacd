import { Editor } from '@tiptap/core';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { createEditorExtensions } from '../editor-sdk/extensions.js';
import { editorDocumentToSdk } from '../editor-conversion/to-sdk.js';
import { createEditorDragSession } from './drag-session.js';
import { createEditorPort } from './use-editor-port.js';

const value = editorDocumentSchema.parse({ version: 1, blocks: [
  { type: 'paragraph', id: 'first', content: [{ type: 'text', text: 'First' }] },
  { type: 'paragraph', id: 'last', content: [{ type: 'text', text: 'Last' }] },
] });
const instances: Editor[] = [];
let restore: () => void = () => undefined;
beforeEach(() => { restore = installEditorGeometry(); });
afterEach(() => {
  for (const instance of instances.splice(0)) instance.destroy();
  restore();
});
function native() {
  const instance = new Editor({ injectCSS: false, extensions: createEditorExtensions(),
    content: editorDocumentToSdk(value) });
  instances.push(instance);
  return instance;
}

it('exposes only guarded capabilities for unavailable editor scopes', () => {
  const editor = native();
  const destroyed = native();
  destroyed.destroy();
  const changed = vi.fn();
  const props = { label: 'Notes', value, onValueChange: changed };
  for (const port of [
    createEditorPort(null, props, false, createEditorDragSession()),
    createEditorPort(editor, props, true, createEditorDragSession()),
    createEditorPort(destroyed, props, false, createEditorDragSession()),
  ]) {
    expect(port.active({ command: 'bold' })).toBe(false);
    expect(port.available({ command: 'bold' })).toBe(false);
    port.execute({ command: 'bold' });
    port.selectBlock('first');
    port.moveBlock('first', 'down');
    expect(port.beginBlockDrag('first')).toBe(false);
    port.cancelBlockDrag();
  }
  expect(changed).not.toHaveBeenCalled();
});

it('uses actual command state and atomic logical move proposals', () => {
  const editor = native();
  const changed = vi.fn();
  const port = createEditorPort(editor, { label: 'Notes', value,
    selection: { anchor: { blockId: 'first', offset: 0 },
      focus: { blockId: 'first', offset: 0 } }, onEditChange: changed },
  false, createEditorDragSession());
  expect(port.active({ command: 'bold' })).toBe(false);
  expect(port.available({ command: 'bold' })).toBe(true);
  port.execute({ command: 'bold' });
  expect(port.active({ command: 'bold' })).toBe(true);
  port.selectBlock('first');
  expect(port.blockMoves('first')).toEqual({ up: false, down: true });
  port.moveBlock('unknown', 'down');
  port.moveBlock('first', 'up');
  expect(changed).not.toHaveBeenCalled();
  port.moveBlock('first', 'down');
  expect(changed).toHaveBeenCalledExactlyOnceWith({
    value: { version: 1, blocks: [value.blocks[1], value.blocks[0]] },
    selection: { anchor: { blockId: 'first', offset: 0 },
      focus: { blockId: 'first', offset: 0 } },
  });
  expect(port.beginBlockDrag('unknown')).toBe(false);
  expect(port.beginBlockDrag('first')).toBe(true);
  port.cancelBlockDrag();
});
