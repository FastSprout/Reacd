import { getSchema } from '@tiptap/core';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { expect, it } from 'vitest';
import { success } from '../../../../test-support/data-table.js';
import { createEditorExtensions } from './extensions.js';
import { domainSelectionToSdk, sdkSelectionToDomain } from './selection-mapping.js';

const schema = getSchema(createEditorExtensions());
const position = (blockId: string, offset: number) => ({ blockId, offset });
function paragraph(id: string | null, text = '') {
  return schema.node('paragraph', { reacdId: id }, text ? [schema.text(text)] : []);
}

it('maps native UTF16 text, atoms and reversed selections without SDK leakage', () => {
  const document = schema.node('doc', null, [
    schema.node('paragraph', { reacdId: 'intro' }, [
      schema.text('A😀'),
      schema.node('reacdMention', { id: 'person', label: 'Example person' }),
      schema.node('reacdEmoji', { name: 'wave', value: '👋' }),
      schema.node('hardBreak'),
      schema.text('Z'),
    ]),
    schema.node('heading', { reacdId: 'title', level: 2 }, [schema.text('Hi')]),
  ]);
  const logical = { anchor: position('title', 2), focus: position('intro', 3) };
  const native = success(domainSelectionToSdk(document, logical));
  expect(native).toEqual({ anchor: 12, head: 4 });
  const restored = sdkSelectionToDomain(
    document,
    TextSelection.create(document, native.anchor, native.head),
  );
  expect(restored).toEqual(logical);
  expect(Object.isFrozen(native)).toBe(true);
  expect(Object.isFrozen(restored)).toBe(true);
  expect(Object.isFrozen(restored?.anchor)).toBe(true);
  expect(Object.isFrozen(restored?.focus)).toBe(true);
  expect(sdkSelectionToDomain(document, { anchor: 5, head: 8 })).toEqual({
    anchor: position('intro', 4),
    focus: position('intro', 7),
  });
});

it('maps nested quotes, lists and empty code blocks', () => {
  const document = schema.node('doc', null, [
    schema.node('blockquote', { reacdId: 'quote' }, [paragraph('quoteText', 'Q')]),
    schema.node('bulletList', { reacdId: 'list' }, [
      schema.node('listItem', { reacdId: 'item' }, [paragraph('itemText', 'L')]),
    ]),
    schema.node('codeBlock', { reacdId: 'code' }),
  ]);
  const logical = { anchor: position('quoteText', 0), focus: position('itemText', 1) };
  expect(success(domainSelectionToSdk(document, logical))).toEqual({
    anchor: 2,
    head: 9,
  });
  expect(sdkSelectionToDomain(document, { anchor: 13, head: 13 })).toEqual({
    anchor: position('code', 0),
    focus: position('code', 0),
  });
});

it('snaps gap and node selections with document-order ties', () => {
  const document = schema.node('doc', null, [
    paragraph('first', 'A'),
    paragraph('second', 'B'),
  ]);
  expect(sdkSelectionToDomain(document, NodeSelection.create(document, 3))).toEqual({
    anchor: position('first', 1),
    focus: position('second', 1),
  });
  expect(sdkSelectionToDomain(document, { anchor: 0, head: 6 })).toEqual({
    anchor: position('first', 0),
    focus: position('second', 1),
  });
});

it('rejects invalid logical offsets and references without native errors', () => {
  const document = schema.node('doc', null, [paragraph('intro', 'A')]);
  for (const endpoint of [
    position('missing', 0),
    position('bad id', 0),
    position('intro', -1),
    position('intro', 2),
    position('intro', 0.5),
    position('intro', Infinity),
  ]) {
    const result = domainSelectionToSdk(document, {
      anchor: position('intro', 0),
      focus: endpoint,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues[0]?.path).toBe('Editor.selection');
  }
});

it('fails closed on invalid native points and documents without identities', () => {
  const document = schema.node('doc', null, [paragraph('intro', 'A')]);
  for (const anchor of [-1, 4, Infinity, 0.5])
    expect(sdkSelectionToDomain(document, { anchor, head: 1 })).toBeUndefined();
  expect(sdkSelectionToDomain(document, { anchor: 1, head: -1 })).toBeUndefined();
  const missing = schema.node('doc', null, [paragraph(null)]);
  const separator = schema.node('doc', null, [
    schema.node('horizontalRule', { reacdId: 'rule' }),
  ]);
  const duplicate = schema.node('doc', null, [paragraph('same'), paragraph('same')]);
  const malformed = schema.node('doc', null, [paragraph('bad id')]);
  for (const invalid of [
    missing,
    separator,
    duplicate,
    malformed,
    paragraph('intro'),
  ]) {
    expect(sdkSelectionToDomain(invalid, { anchor: 0, head: 0 })).toBeUndefined();
    expect(
      domainSelectionToSdk(invalid, {
        anchor: position('intro', 0),
        focus: position('intro', 0),
      }).success,
    ).toBe(false);
  }
});

it('contains private attributes that become unreadable after the budget guard', () => {
  const block = paragraph('intro');
  let reads = 0;
  Object.defineProperty(block.attrs, 'reacdId', {
    get() {
      reads += 1;
      if (reads > 1) throw new Error('Unreadable private attributes.');
      return 'intro';
    },
  });
  const document = schema.node('doc', null, [block]);
  expect(sdkSelectionToDomain(document, { anchor: 1, head: 1 })).toBeUndefined();
  expect(reads).toBe(2);
});
