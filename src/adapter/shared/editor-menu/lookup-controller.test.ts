import { expect, it } from 'vitest';
import { EDITOR_LOOKUP_POLICY } from '../../../core/editor-lookup-policy.js';
import * as lookup from '../../../schema/editor-mention-menu/lookup.schema.js';
import {
  advanceMentionLookup,
  createMentionLookupController,
} from './lookup-controller.js';

it('emits one scoped request for each changed or reopened exact query', () => {
  const first = createMentionLookupController(':r0:');
  const other = createMentionLookupController(':r1:');
  const a = first.update('A', null);
  expect(a.request).toEqual({ key: ':r0::1', query: 'A' });
  expect(Object.isFrozen(a.request)).toBe(true);
  expect(Object.isFrozen(a)).toBe(true);
  expect(a.status).toBe('loading');
  expect(a.items).toEqual([]);
  expect(a.error).toBeUndefined();
  expect(first.update('A', null).request).toBeUndefined();
  expect(first.update('B', null).request?.key).toBe(':r0::2');
  expect(first.update('A', null).request?.key).toBe(':r0::3');
  first.close();
  expect(first.update('A', null).request?.key).toBe(':r0::4');
  expect(other.update('A', null).request?.key).toBe(':r1::1');
  expect(createMentionLookupController(':r0:').update('A', null).request).toEqual(
    a.request,
  );
});

it('rejects A/B/A stale results and keeps accepted authoritative fuzzy matches', () => {
  const controller = createMentionLookupController('scope');
  const first = controller.update('A', null).request;
  const second = controller.update('B', null).request;
  const third = controller.update('A', null).request;
  if (!first || !second || !third) throw new Error('Expected distinct query requests.');
  const stale = lookup.editorMentionLookupResultSchema.parse({
    ...first,
    status: 'ready',
    items: [{ id: 'old', label: 'Old result' }],
  });
  expect(controller.update('A', stale).status).toBe('loading');
  const wrongQuery = lookup.editorMentionLookupResultSchema.parse({
    ...third,
    query: 'B',
    status: 'error',
    error: 'Wrong query.',
  });
  expect(controller.update('A', wrongQuery).status).toBe('loading');
  const ready = lookup.editorMentionLookupResultSchema.parse({
    ...third,
    status: 'ready',
    items: [
      { id: 'fuzzy', label: 'Engineer result', disabled: true },
      { id: 'next', label: 'Second result' },
    ],
  });
  if (ready.status !== 'ready') throw new Error('Expected ready results.');
  expect(controller.update('A', ready).items).toEqual(ready.items);
  expect(controller.update('A', null).items).toEqual(ready.items);
  expect(controller.update('A', stale).items).toEqual(ready.items);
  expect(controller.update('A', wrongQuery).items).toEqual(ready.items);
  controller.close();
  expect(controller.update('A', ready).status).toBe('loading');
});

it('retains terminal state and accepts matching retry completion', () => {
  const controller = createMentionLookupController('scope');
  const request = controller.update('', null).request;
  if (!request) throw new Error('Expected empty query request.');
  const loading = lookup.editorMentionLookupResultSchema.parse({
    ...request,
    status: 'loading',
  });
  const failure = lookup.editorMentionLookupResultSchema.parse({
    ...request,
    status: 'error',
    error: 'Try again.',
  });
  const ready = lookup.editorMentionLookupResultSchema.parse({
    ...request,
    status: 'ready',
    items: [],
  });
  expect(controller.update('', loading).status).toBe('loading');
  expect(controller.update('', loading).status).toBe('loading');
  expect(controller.update('', failure)).toMatchObject({
    status: 'error',
    error: 'Try again.',
  });
  expect(controller.update('', loading).status).toBe('error');
  expect(controller.update('', ready)).toMatchObject({
    status: 'ready',
    items: [],
    error: undefined,
  });
  expect(controller.update('', loading).status).toBe('ready');
  expect(controller.update('', failure).status).toBe('error');
});

it('bounds invalid scope/query errors and invalidates old cache', () => {
  for (const scope of ['', 'x'.repeat(EDITOR_LOOKUP_POLICY.maxScopeLength + 1)]) {
    const invalid = createMentionLookupController(scope);
    expect(invalid.update('valid', null)).toMatchObject({
      request: undefined,
      status: 'error',
      items: [],
      error: EDITOR_LOOKUP_POLICY.invalidScopeMessage,
    });
  }
  const controller = createMentionLookupController('valid');
  const request = controller.update('A', null).request;
  if (!request) throw new Error('Expected valid request.');
  const ready = lookup.editorMentionLookupResultSchema.parse({
    ...request,
    status: 'ready',
    items: [],
  });
  controller.update('A', ready);
  expect(
    controller.update('x'.repeat(EDITOR_LOOKUP_POLICY.maxQueryLength + 1), ready),
  ).toMatchObject({
    request: undefined,
    status: 'error',
    items: [],
    error: EDITOR_LOOKUP_POLICY.invalidQueryMessage,
  });
  const reopened = controller.update('A', ready);
  expect(reopened.request?.key).toBe('valid:2');
  expect(reopened.status).toBe('loading');
});

it('fails closed on correlation exhaustion without mutating a prior snapshot', () => {
  const ordinal = 10n ** BigInt(EDITOR_LOOKUP_POLICY.maxKeyLength);
  const state = Object.freeze({
    scope: 'bounded',
    ordinal,
    current: undefined,
    accepted: undefined,
  });
  const result = advanceMentionLookup(state, 'query', null);
  expect(result.view).toEqual({
    request: undefined,
    status: 'error',
    items: [],
    error: EDITOR_LOOKUP_POLICY.invalidRequestMessage,
  });
  expect(result.state.current).toBeUndefined();
  expect(result.state.accepted).toBeUndefined();
  expect(state.ordinal).toBe(ordinal);
  expect(result.state.ordinal).toBe(ordinal + 1n);
});
