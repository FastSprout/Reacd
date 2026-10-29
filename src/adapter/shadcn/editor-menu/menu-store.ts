import type {
  EditorMenuItem,
  EditorMenuLease,
  EditorMenuLookupState,
  EditorMenuPort,
  EditorMenuRequest,
  EditorMenuView,
} from '../../../renderer/editor/menu-context.js';
import type { ValidationIssue } from '../../../core/render-port.js';
import type {
  EditorMentionLookupRequest,
  EditorMentionLookupResult,
} from '../../../schema/editor-mention-menu/lookup.schema.js';
import { createMentionLookupController } from './lookup-controller.js';

export interface MentionLookupSource {
  readonly results: EditorMentionLookupResult | null;
  readonly onQueryChange: (request: EditorMentionLookupRequest) => void;
}
export type EditorMenuSnapshot =
  | { readonly view: EditorMenuView }
  | { readonly issues: readonly ValidationIssue[] }
  | undefined;

export function createEditorMenuStore(
  initial: readonly EditorMenuItem[],
  scope: string,
) {
  let catalog = initial;
  let remote: MentionLookupSource | undefined;
  let snapshot: EditorMenuSnapshot;
  let lease: EditorMenuLease | undefined;
  let attachment: object | undefined;
  const lookup = createMentionLookupController(scope);
  const listeners = new Set<() => void>();
  function publish(next: EditorMenuSnapshot) {
    if (snapshot === next) return;
    snapshot = next;
    for (const listener of listeners) listener();
  }
  function resolve(query: string): EditorMenuLookupState | undefined {
    if (remote === undefined) return undefined;
    const next = lookup.update(query, remote.results);
    if (next.request !== undefined) remote.onQueryChange(next.request);
    return {
      status: next.status,
      error: next.error,
      items: next.items.map((item) => ({ ...item, kind: 'mention' })),
    };
  }
  return {
    snapshot: () => snapshot,
    serverSnapshot: () => undefined,
    subscribe(this: void, listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    catalog(items: readonly EditorMenuItem[], source: MentionLookupSource | undefined) {
      catalog = items;
      remote = source;
      if (source === undefined) lookup.close();
      lease?.refresh();
    },
    attach(port: EditorMenuPort, options: Pick<EditorMenuRequest, 'kind' | 'listId'>) {
      const owner = Object.freeze({});
      attachment = owner;
      lease = undefined;
      let released = false;
      const current = () => !released && attachment === owner;
      const mounted = port.mount({
        ...options,
        items: () => (current() ? catalog : []),
        lookup: (query) => (current() ? resolve(query) : undefined),
        change: (view) => {
          if (!current()) return;
          if (view === undefined) lookup.close();
          publish(view === undefined ? undefined : { view });
        },
      });
      if (!mounted.success) {
        publish({ issues: mounted.issues });
        return () => {
          if (!current()) return;
          released = true;
          attachment = undefined;
          lookup.close();
          publish(undefined);
        };
      }
      lease = mounted.data;
      return () => {
        if (released) return;
        released = true;
        mounted.data.destroy();
        if (attachment === owner) {
          attachment = undefined;
          lease = undefined;
          lookup.close();
          publish(undefined);
        }
      };
    },
    choose(index: number) {
      lease?.choose(index);
    },
  };
}
