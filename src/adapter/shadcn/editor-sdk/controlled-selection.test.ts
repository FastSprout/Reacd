import { expect, it } from 'vitest';
import { sameEditorSelection } from './controlled-selection.js';

it('deduplicates logical selections while distinguishing both endpoints', () => {
  const selection = {
    anchor: { blockId: 'first', offset: 0 },
    focus: { blockId: 'last', offset: 5 },
  };
  expect(sameEditorSelection(undefined, undefined)).toBe(true);
  expect(sameEditorSelection(selection, undefined)).toBe(false);
  expect(sameEditorSelection(undefined, selection)).toBe(false);
  expect(sameEditorSelection(selection, structuredClone(selection))).toBe(true);
  for (const other of [
    { ...selection, anchor: { blockId: 'other', offset: 0 } },
    { ...selection, anchor: { blockId: 'first', offset: 1 } },
    { ...selection, focus: { blockId: 'other', offset: 5 } },
    { ...selection, focus: { blockId: 'last', offset: 4 } },
  ])
    expect(sameEditorSelection(selection, other)).toBe(false);
});
