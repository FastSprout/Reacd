import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import type { EditorMenuKind } from
  '@fastsprout/reacd/adapter-runtime/core/editor-menu-policy.js';
import { EditorMenuScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import type { EditorMenuItem } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import type { EditorMenuSnapshot, MentionLookupSource } from './menu-store.js';
import { createEditorMenuStore } from './menu-store.js';

export function useEditorMenu(
  kind: EditorMenuKind,
  items: readonly EditorMenuItem[],
  disabled: boolean | undefined,
  lookup?: MentionLookupSource,
): {
  listId: string;
  orphan: boolean;
  snapshot: EditorMenuSnapshot;
  choose: (index: number) => void;
} {
  const listId = useId();
  const port = useContext(EditorMenuScopeContext);
  const [store] = useState(() => createEditorMenuStore(items, listId));
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.snapshot,
    store.serverSnapshot,
  );
  useLayoutEffect(() => store.catalog(items, lookup), [store, items, lookup]);
  useEffect(() => {
    if (port === null || port.disabled || disabled === true) return undefined;
    return store.attach(port, { kind, listId });
  }, [port, kind, listId, disabled, store]);
  return {
    listId,
    orphan: port === null,
    snapshot,
    choose: (index: number) => store.choose(index),
  };
}
