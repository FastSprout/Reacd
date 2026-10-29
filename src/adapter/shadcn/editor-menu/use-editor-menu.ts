import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import type { EditorMenuKind } from '../../../core/editor-menu-policy.js';
import { EditorMenuScopeContext } from '../../../renderer/editor/menu-context.js';
import type { EditorMenuItem } from '../../../renderer/editor/menu-context.js';
import type { MentionLookupSource } from './menu-store.js';
import { createEditorMenuStore } from './menu-store.js';

export function useEditorMenu(
  kind: EditorMenuKind,
  items: readonly EditorMenuItem[],
  disabled: boolean | undefined,
  lookup?: MentionLookupSource,
) {
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
