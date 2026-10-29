import { getSchema } from '@tiptap/core';
import { EditorState, Plugin, TextSelection } from '@tiptap/pm/state';
import { history, redo, undo } from '@tiptap/pm/history';
import { expect, it, vi } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { createEditorExtensions } from './extensions.js';
import { createEditorIdentityPlugin } from './identity-plugin.js';

const schema = getSchema(createEditorExtensions());

function paragraph(id: string | null, text = 'Text') {
  return schema.node('paragraph', { reacdId: id }, [schema.text(text)]);
}

function ids(state: EditorState) {
  const result: unknown[] = [];
  state.doc.descendants((node) => {
    if (node.isBlock) {
      const value: unknown = node.attrs['reacdId'];
      result.push(value);
    }
  });
  return result;
}

it('repairs split ids without mutating old state or adding an append loop', () => {
  const rejected = vi.fn();
  const plugin = createEditorIdentityPlugin({ onRejected: rejected });
  const before = EditorState.create({
    schema,
    doc: schema.node('doc', null, [paragraph('first', 'Hello')]),
    plugins: [history(), plugin],
  });
  expect(rejected).not.toHaveBeenCalled();
  const transaction = before.tr.split(3);
  const result = before.applyTransaction(transaction);
  expect(result.transactions).toHaveLength(2);
  expect(ids(result.state)).toEqual(['first', 'block-1']);
  expect(ids(before)).toEqual(['first']);
  expect(result.transactions[1]?.getMeta('addToHistory')).toBe(false);
  const replay = before.applyTransaction(transaction);
  expect(ids(replay.state)).toEqual(ids(result.state));
  const selection = result.state.applyTransaction(
    result.state.tr.setSelection(TextSelection.near(result.state.doc.resolve(1))),
  );
  expect(selection.transactions).toHaveLength(1);
  expect(ids(selection.state)).toEqual(['first', 'block-1']);
  expect(rejected).not.toHaveBeenCalled();
});

it('avoids reserved ids and preserves unrelated native attributes', () => {
  const plugin = createEditorIdentityPlugin();
  const before = EditorState.create({
    schema,
    doc: schema.node('doc', null, [
      paragraph('block-1'),
      schema.node('heading', { reacdId: null, level: 3 }, [schema.text('Heading')]),
    ]),
    plugins: [plugin],
  });
  const after = before.apply(before.tr.insertText('x', 1));
  expect(ids(after)).toEqual(['block-1', 'block-2']);
  expect(after.doc.child(1).attrs['level']).toBe(3);
  expect(before.doc.child(1).attrs['reacdId']).toBeNull();
});

it('isolates plugin counters and keeps identities through undo and redo', () => {
  const first = createEditorIdentityPlugin();
  const second = createEditorIdentityPlugin();
  const document = schema.node('doc', null, [paragraph('intro', 'Hello')]);
  const original = EditorState.create({
    schema,
    doc: document,
    plugins: [history(), first],
  });
  let current = original.apply(original.tr.split(3));
  const separate = EditorState.create({ schema, doc: document, plugins: [second] });
  expect(ids(separate.apply(separate.tr.split(3)))).toEqual(['intro', 'block-1']);
  expect(
    undo(current, (transaction) => {
      current = current.apply(transaction);
    }),
  ).toBe(true);
  expect(ids(current)).toEqual(['intro']);
  expect(
    redo(current, (transaction) => {
      current = current.apply(transaction);
    }),
  ).toBe(true);
  expect(ids(current)).toEqual(['intro', 'block-1']);
  current = current.apply(current.tr.setMeta(first, -1n));
  const next = current.apply(current.tr.split(2));
  expect(ids(next)).toEqual(['intro', 'block-2', 'block-1']);
});

it('rejects native changes and generated ids outside the exact budget', () => {
  const rejected = vi.fn();
  const plugin = createEditorIdentityPlugin({ onRejected: rejected });
  const before = EditorState.create({
    schema,
    doc: schema.node('doc', null, [paragraph('intro')]),
    plugins: [plugin],
  });
  const tooLong = before.tr.insertText('a'.repeat(EDITOR_POLICY.maxCharacters + 1), 1);
  expect(before.applyTransaction(tooLong).transactions).toHaveLength(0);
  expect(rejected).toHaveBeenCalledExactlyOnceWith();
  const oversizedId = before.tr.split(2).setMeta(plugin, 10n ** 100n);
  expect(before.applyTransaction(oversizedId).transactions).toHaveLength(0);
  expect(rejected).toHaveBeenCalledTimes(2);
  const invalid = before.tr.setNodeMarkup(0, undefined, { reacdId: 'bad id' });
  expect(before.applyTransaction(invalid).transactions).toHaveLength(0);
  expect(rejected).toHaveBeenCalledTimes(3);
});

it('retains pending repair across another plugin selection transaction', () => {
  const adjustment = new Plugin({
    appendTransaction(transactions, _previous, state) {
      if (!transactions.some((transaction) => transaction.getMeta('adjustSelection')))
        return null;
      return state.tr.setSelection(TextSelection.near(state.doc.resolve(1)));
    },
  });
  const identity = createEditorIdentityPlugin();
  const before = EditorState.create({
    schema,
    doc: schema.node('doc', null, [paragraph('intro', 'Hello')]),
    plugins: [adjustment, identity],
  });
  const result = before.applyTransaction(
    before.tr.split(3).setMeta('adjustSelection', true),
  );
  expect(result.transactions).toHaveLength(3);
  expect(ids(result.state)).toEqual(['intro', 'block-1']);
});

it('rejects malformed private attribute records without a rejection observer', () => {
  const malformed = paragraph('intro');
  Object.defineProperty(malformed, 'attrs', {
    value: Object.assign(new Date(0), { reacdId: 'intro' }),
  });
  const before = EditorState.create({
    schema,
    doc: schema.node('doc', null, [malformed, paragraph('next')]),
    plugins: [createEditorIdentityPlugin()],
  });
  expect(
    before.applyTransaction(before.tr.insertText('x', 7)).transactions,
  ).toHaveLength(0);
});

it('does not evaluate a foreign editor state as its own identity scope', () => {
  const plugin = createEditorIdentityPlugin();
  const state = EditorState.create({
    schema,
    doc: schema.node('doc', null, [paragraph('intro')]),
  });
  const transaction = state.tr.insertText('x', 1);
  const filter = plugin.spec.filterTransaction;
  const append = plugin.spec.appendTransaction;
  if (filter === undefined || append === undefined)
    throw new Error('Identity transaction guards must exist.');
  expect(filter.call(plugin, transaction, state)).toBe(false);
  expect(append.call(plugin, [transaction], state, state)).toBeNull();
});
