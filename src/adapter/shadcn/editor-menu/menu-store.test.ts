import { expect, it, vi } from 'vitest';
import type {
  EditorMenuItem,
  EditorMenuLease,
  EditorMenuPort,
  EditorMenuRequest,
  EditorMenuView,
} from '../../../renderer/editor/menu-context.js';
import { createEditorMenuStore } from './menu-store.js';
import type {
  EditorMentionLookupRequest,
} from '../../../schema/editor-mention-menu/lookup.schema.js';

const ITEMS: readonly EditorMenuItem[] = [
  { kind: 'mention', id: 'person', label: 'Example person' },
];
const VIEW: EditorMenuView = {
  query: 'ex',
  items: ITEMS,
  selected: 0,
  status: 'ready',
  error: undefined,
};
const OPTIONS = { kind: 'mention', listId: 'mentions' } as const;
function resource() {
  const requests: EditorMenuRequest[] = [];
  const lease = {
    choose: vi.fn<(index: number) => void>(),
    close: vi.fn(),
    refresh: vi.fn(),
    destroy: vi.fn(),
  } satisfies EditorMenuLease;
  const port: EditorMenuPort = {
    disabled: false,
    mount(request) {
      requests.push(request);
      return { success: true, data: lease };
    },
  };
  return { port, lease, requests };
}
function requestOf(resourceValue: ReturnType<typeof resource>): EditorMenuRequest {
  const request = resourceValue.requests[0];
  if (request === undefined) throw new Error('Resource was not attached.');
  return request;
}

it('refreshes catalogs and releases exact resources', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const notify = vi.fn();
  const unsubscribe = store.subscribe(notify);
  store.choose(1);
  store.catalog([], undefined);
  expect(store.snapshot()).toBeUndefined();
  const mounted = resource();
  const cleanup = store.attach(mounted.port, OPTIONS);
  const request = requestOf(mounted);
  expect(request.items()).toEqual([]);
  expect(request.lookup?.('ex')).toBeUndefined();
  request.change(undefined);
  expect(notify).not.toHaveBeenCalled();
  store.catalog(ITEMS, undefined);
  expect(request.items()).toBe(ITEMS);
  expect(mounted.lease.refresh).toHaveBeenCalledExactlyOnceWith();
  request.change(VIEW);
  expect(store.snapshot()).toEqual({ view: VIEW });
  expect(store.serverSnapshot()).toBeUndefined();
  expect(notify).toHaveBeenCalledOnce();
  store.choose(0);
  expect(mounted.lease.choose).toHaveBeenCalledExactlyOnceWith(0);
  unsubscribe();
  cleanup();
  cleanup();
  expect(mounted.lease.destroy).toHaveBeenCalledExactlyOnceWith();
  expect(store.snapshot()).toBeUndefined();
  store.choose(1);
  expect(mounted.lease.choose).toHaveBeenCalledOnce();
  expect(notify).toHaveBeenCalledOnce();
});

it('publishes rejected attachment diagnostics and clears them on cleanup', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const issues = [{ path: 'EditorMentionMenu', message: 'Duplicate menu.' }];
  const rejected: EditorMenuPort = {
    disabled: false,
    mount: () => ({ success: false, issues }),
  };
  const cleanup = store.attach(rejected, OPTIONS);
  expect(store.snapshot()).toEqual({ issues });
  cleanup();
  expect(store.snapshot()).toBeUndefined();
});

it('does not let stale cleanup erase a newer resource view', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const previous = resource();
  const latest = resource();
  const oldCleanup = store.attach(previous.port, OPTIONS);
  const newCleanup = store.attach(latest.port, OPTIONS);
  requestOf(latest).change(VIEW);
  oldCleanup();
  expect(previous.lease.destroy).toHaveBeenCalledOnce();
  expect(store.snapshot()).toEqual({ view: VIEW });
  store.choose(0);
  expect(latest.lease.choose).toHaveBeenCalledExactlyOnceWith(0);
  newCleanup();
});

it('ignores view callbacks from a superseded resource', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const previous = resource();
  const latest = resource();
  const oldCleanup = store.attach(previous.port, OPTIONS);
  const newCleanup = store.attach(latest.port, OPTIONS);
  requestOf(latest).change(VIEW);
  requestOf(previous).change(undefined);
  expect(store.snapshot()).toEqual({ view: VIEW });
  requestOf(previous).change({ ...VIEW, query: 'stale' });
  expect(store.snapshot()).toEqual({ view: VIEW });
  expect(requestOf(previous).items()).toEqual([]);
  oldCleanup();
  newCleanup();
});

it('cannot issue remote requests through a superseded resource', () => {
  const store = createEditorMenuStore([], 'scope');
  const changed = vi.fn();
  store.catalog([], { results: null, onQueryChange: changed });
  const previous = resource();
  const latest = resource();
  const oldCleanup = store.attach(previous.port, OPTIONS);
  const newCleanup = store.attach(latest.port, OPTIONS);
  expect(requestOf(previous).lookup?.('stale')).toBeUndefined();
  expect(changed).not.toHaveBeenCalled();
  expect(requestOf(latest).lookup?.('current')?.status).toBe('loading');
  expect(changed).toHaveBeenCalledOnce();
  oldCleanup();
  newCleanup();
});

it('retains current remote data and starts a fresh cycle after closing', () => {
  const store = createEditorMenuStore([], 'scope');
  const changed = vi.fn<(request: EditorMentionLookupRequest) => void>();
  store.catalog([], { results: null, onQueryChange: changed });
  const mounted = resource();
  const cleanup = store.attach(mounted.port, OPTIONS);
  const native = requestOf(mounted);
  expect(native.lookup?.('js')?.status).toBe('loading');
  const request = changed.mock.calls[0]?.[0];
  if (request === undefined) throw new Error('Remote request is required.');
  store.catalog([], {
    results: {
      ...request,
      status: 'ready',
      items: [{ id: 'person', label: 'John Smith' }],
    },
    onQueryChange: changed,
  });
  expect(native.lookup?.('js')).toEqual({
    status: 'ready',
    error: undefined,
    items: [{ id: 'person', label: 'John Smith', kind: 'mention' }],
  });
  expect(changed).toHaveBeenCalledOnce();
  native.change(undefined);
  expect(native.lookup?.('js')?.status).toBe('loading');
  const reopened = changed.mock.calls[1]?.[0];
  expect(reopened?.query).toBe('js');
  expect(reopened?.key).not.toBe(request.key);
  cleanup();
  expect(native.lookup?.('closed')).toBeUndefined();
  expect(changed).toHaveBeenCalledTimes(2);
});

it('does not let a rejected attachment cleanup clear a later valid view', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const rejected: EditorMenuPort = {
    disabled: false,
    mount: () => ({
      success: false,
      issues: [{ path: 'Menu', message: 'Unavailable.' }],
    }),
  };
  const oldCleanup = store.attach(rejected, OPTIONS);
  const latest = resource();
  const cleanup = store.attach(latest.port, OPTIONS);
  requestOf(latest).change(VIEW);
  oldCleanup();
  expect(store.snapshot()).toEqual({ view: VIEW });
  cleanup();
});

it('revokes the prior lease when its replacement is rejected', () => {
  const store = createEditorMenuStore(ITEMS, 'scope');
  const previous = resource();
  const cleanup = store.attach(previous.port, OPTIONS);
  const rejected: EditorMenuPort = {
    disabled: false,
    mount: () => ({ success: false, issues: [{ path: 'Menu', message: 'Rejected.' }] }),
  };
  const releaseRejected = store.attach(rejected, OPTIONS);
  store.choose(0);
  store.catalog([], undefined);
  expect(previous.lease.choose).not.toHaveBeenCalled();
  expect(previous.lease.refresh).not.toHaveBeenCalled();
  releaseRejected();
  releaseRejected();
  cleanup();
  expect(previous.lease.destroy).toHaveBeenCalledExactlyOnceWith();
});
