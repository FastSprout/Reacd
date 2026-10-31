import { Editor } from '@tiptap/core';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import type { EditorCommand } from '../../../core/editor-commands.js';
import { createEditorExtensions } from './extensions.js';
import { runSdkCommand, canRunSdkCommand, sdkCommandActive } from './commands.js';

let restore: () => void = () => undefined;
const editors: Editor[] = [];
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => {
  for (const editor of editors.splice(0)) editor.destroy();
  restore();
});
function editor() {
  const instance = new Editor({
    injectCSS: false,
    extensions: createEditorExtensions(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { reacdId: 'intro' },
          content: [{ type: 'text', text: 'Example' }],
        },
      ],
    },
  });
  instance.commands.setTextSelection({ from: 1, to: 8 });
  editors.push(instance);
  return instance;
}

it('formats marks and headings through closed commands with active state', () => {
  for (const command of [
    'bold',
    'italic',
    'strike',
    'underline',
    'code',
    'heading1',
    'heading2',
    'heading3',
  ] as const) {
    const instance = editor();
    expect(canRunSdkCommand(instance, { command })).toBe(true);
    expect(runSdkCommand(instance, { command })).toBe(true);
    expect(sdkCommandActive(instance, { command })).toBe(true);
  }
});

it('supports closed block formatting, separators and explicit safe links', () => {
  for (const command of ['bulletList', 'orderedList', 'quote', 'codeBlock'] as const) {
    const instance = editor();
    expect(runSdkCommand(instance, { command })).toBe(true);
    expect(sdkCommandActive(instance, { command })).toBe(true);
  }
  const instance = editor();
  expect(runSdkCommand(instance, { command: 'heading1' })).toBe(true);
  expect(runSdkCommand(instance, { command: 'paragraph' })).toBe(true);
  expect(sdkCommandActive(instance, { command: 'paragraph' })).toBe(true);
  const link: EditorCommand = { command: 'link', href: '/reference' };
  expect(runSdkCommand(instance, link)).toBe(true);
  expect(sdkCommandActive(instance, link)).toBe(true);
  expect(runSdkCommand(instance, { command: 'removeLink' })).toBe(true);
  expect(sdkCommandActive(instance, link)).toBe(false);
  expect(runSdkCommand(instance, { command: 'separator' })).toBe(true);
  expect(
    instance.getJSON().content?.some((node) => node.type === 'horizontalRule'),
  ).toBe(true);
});

it('restores history and rejects unsafe or unavailable commands', () => {
  const instance = editor();
  expect(canRunSdkCommand(instance, { command: 'undo' })).toBe(false);
  expect(runSdkCommand(instance, { command: 'undo' })).toBe(false);
  instance.commands.insertContent({ type: 'text', text: 'Changed' });
  expect(runSdkCommand(instance, { command: 'undo' })).toBe(true);
  expect(instance.getText()).toBe('Example');
  expect(runSdkCommand(instance, { command: 'redo' })).toBe(true);
  expect(instance.getText()).toBe('Changed');
  for (const command of ['undo', 'redo', 'separator', 'removeLink'] as const)
    expect(sdkCommandActive(instance, { command })).toBe(false);
  const unsafe: EditorCommand = { command: 'link', href: 'javascript:run()' };
  expect(canRunSdkCommand(instance, unsafe)).toBe(false);
  expect(runSdkCommand(instance, unsafe)).toBe(false);
  instance.destroy();
  expect(canRunSdkCommand(instance, { command: 'bold' })).toBe(false);
  expect(runSdkCommand(instance, { command: 'bold' })).toBe(false);
  expect(sdkCommandActive(instance, { command: 'bold' })).toBe(false);
});
