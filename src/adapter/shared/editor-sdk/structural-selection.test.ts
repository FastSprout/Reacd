import { Editor, getSchema } from '@tiptap/core';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { createEditorExtensions } from './extensions.js';
import { selectedSdkBlockId, sdkBlockPosition } from './structural-selection.js';
import { selectSdkBlock } from './select-block.js';

const schema = getSchema(createEditorExtensions());
const EDITABLE = {
  type: 'paragraph',
  attrs: { reacdId: 'intro' },
  content: [{ type: 'text', text: 'Intro' }],
};
const CONTENT = {
  type: 'doc',
  content: [
    EDITABLE,
    { type: 'horizontalRule', attrs: { reacdId: 'rule' } },
    {
      type: 'blockquote',
      attrs: { reacdId: 'quote' },
      content: [
        {
          type: 'paragraph',
          attrs: { reacdId: 'quoteText' },
          content: [{ type: 'text', text: 'Quoted' }],
        },
        { type: 'paragraph', attrs: { reacdId: 'quoteTail' } },
      ],
    },
    {
      type: 'bulletList',
      attrs: { reacdId: 'list' },
      content: [
        {
          type: 'listItem',
          attrs: { reacdId: 'item' },
          content: [
            {
              type: 'paragraph',
              attrs: { reacdId: 'itemText' },
              content: [{ type: 'text', text: 'Listed' }],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: { reacdId: 'ruleQuote' },
      content: [{ type: 'horizontalRule', attrs: { reacdId: 'nestedRule' } }],
    },
  ],
};
const editors: Editor[] = [];
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
});
afterEach(() => {
  for (const editor of editors.splice(0)) editor.destroy();
  restore();
});
function create() {
  const editor = new Editor({
    injectCSS: false,
    extensions: createEditorExtensions(),
    content: CONTENT,
  });
  editors.push(editor);
  return editor;
}

it('keeps structural ids distinct from the neighboring text caret', () => {
  const document = schema.nodeFromJSON(CONTENT);
  const position = sdkBlockPosition(document, 'rule');
  if (position === undefined) throw new Error('Separator position is required.');
  expect(selectedSdkBlockId(NodeSelection.create(document, position))).toBe('rule');
  expect(selectedSdkBlockId(TextSelection.create(document, 1))).toBeUndefined();
  for (const id of [null, 'bad id']) {
    const invalid = schema.node('doc', null, [
      schema.node('horizontalRule', { reacdId: id }),
    ]);
    expect(selectedSdkBlockId(NodeSelection.create(invalid, 0))).toBeUndefined();
  }
});

it('resolves exact nested ids and rejects unknown positions', () => {
  const document = schema.nodeFromJSON(CONTENT);
  for (const id of [
    'intro',
    'rule',
    'quote',
    'quoteText',
    'list',
    'item',
    'itemText',
  ]) {
    const position = sdkBlockPosition(document, id);
    expect(position).toBeTypeOf('number');
    if (position === undefined) throw new Error('Known id has no position.');
    expect(document.nodeAt(position)?.attrs['reacdId']).toBe(id);
  }
  expect(sdkBlockPosition(document, 'missing')).toBeUndefined();
});

it('selects nested editable points and preserves native nontext selections', () => {
  const editor = create();
  for (const [target, expected] of [
    ['intro', 'intro'],
    ['quote', 'quoteText'],
    ['quoteText', 'quoteText'],
    ['list', 'itemText'],
    ['item', 'itemText'],
    ['itemText', 'itemText'],
  ] as const) {
    expect(selectSdkBlock(editor, target)).toBe(true);
    expect(editor.state.selection instanceof TextSelection).toBe(true);
    expect(editor.state.selection.$anchor.parent.attrs['reacdId']).toBe(expected);
    expect(editor.state.selection.$anchor.parentOffset).toBe(0);
  }
  for (const id of ['rule', 'ruleQuote', 'nestedRule']) {
    expect(selectSdkBlock(editor, id)).toBe(true);
    expect(editor.state.selection instanceof NodeSelection).toBe(true);
    expect(selectedSdkBlockId(editor.state.selection)).toBe(id);
  }
  const before = editor.state.selection;
  const value = editor.getJSON();
  expect(selectSdkBlock(editor, 'missing')).toBe(false);
  expect(editor.state.selection).toBe(before);
  expect(editor.getJSON()).toEqual(value);
});
