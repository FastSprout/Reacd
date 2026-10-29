import { expect, it } from 'vitest';
import { EDITOR_MENU_POLICY } from '../../core/editor-menu-policy.js';
import { EDITOR_LOOKUP_POLICY } from '../../core/editor-lookup-policy.js';
import { editorMentionItemSchema, editorMentionItemsSchema } from './item.schema.js';
import {
  editorMentionLookupRequestSchema,
  editorMentionLookupResultSchema,
} from './lookup.schema.js';

const correlation = { key: ':r0::1', query: ' EnGineer ' };

it('preserves exact bounded queries and opaque readonly correlation keys', () => {
  const request = editorMentionLookupRequestSchema.parse(correlation);
  expect(request).toEqual(correlation);
  expect(Object.isFrozen(request)).toBe(true);
  expect(
    editorMentionLookupRequestSchema.safeParse({ key: '_r_1_:1', query: '' }).success,
  ).toBe(true);
  for (const invalid of [
    { ...correlation, key: '' },
    { ...correlation, key: 'x'.repeat(EDITOR_LOOKUP_POLICY.maxKeyLength + 1) },
    { ...correlation, query: 'x'.repeat(EDITOR_MENU_POLICY.maxQuery + 1) },
    { ...correlation, callback() {} },
    { ...correlation, query: null },
  ])
    expect(editorMentionLookupRequestSchema.safeParse(invalid).success).toBe(false);
});

it('accepts closed result statuses with echoed correlations', () => {
  for (const status of [
    { status: 'loading' },
    { status: 'ready', items: [{ id: 'person', label: ' Ada ' }] },
    { status: 'error', error: 'Lookup unavailable.' },
  ]) {
    const result = editorMentionLookupResultSchema.parse({ ...correlation, ...status });
    expect(Object.isFrozen(result)).toBe(true);
    if (result.status === 'ready') {
      expect(result.items).toEqual([{ id: 'person', label: 'Ada' }]);
      expect(Object.isFrozen(result.items)).toBe(true);
      expect(Object.isFrozen(result.items[0])).toBe(true);
    }
  }
  for (const invalid of [
    { status: 'ready' },
    { status: 'loading', items: [] },
    { status: 'error', error: '' },
    { status: 'error', error: 'x'.repeat(EDITOR_LOOKUP_POLICY.maxErrorLength + 1) },
    { status: 'ready', items: [], error: 'Mixed' },
    { status: 'unknown' },
    { status: 'loading', query: undefined },
    { status: 'ready', items: [{ id: 'a', label: 'A', html: '<b>A</b>' }] },
  ])
    expect(
      editorMentionLookupResultSchema.safeParse({ ...correlation, ...invalid }).success,
    ).toBe(false);
});

it('retains canonical mention item rules and bounded unique remote catalogs', () => {
  expect(
    editorMentionItemSchema.parse({ id: 'person', label: ' Ada ', disabled: true }),
  ).toEqual({ id: 'person', label: 'Ada', disabled: true });
  expect(editorMentionItemsSchema.parse([])).toEqual([]);
  for (const invalid of [
    [
      { id: 'same', label: 'A' },
      { id: 'same', label: 'B' },
    ],
    [{ id: 'bad id', label: 'A' }],
    Array.from({ length: EDITOR_MENU_POLICY.maxItems + 1 }, (_, index) => ({
      id: `person-${index}`,
      label: `Person ${index}`,
    })),
  ])
    expect(editorMentionItemsSchema.safeParse(invalid).success).toBe(false);
});
