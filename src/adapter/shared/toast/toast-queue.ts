import { createToastFocus } from './toast-focus.js';
import { atom, createStore } from 'jotai/vanilla';
import { TOAST_POLICY } from '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
export function createToastQueue() {
  const keys = atom<ReadonlySet<string>>(new Set<string>());
  const store = createStore();
  return {
    focus: createToastFocus(),
    keys,
    store,
    reserve(id: string): boolean {
      const active = store.get(keys);
      if (active.has(id)) return true;
      if (active.size >= TOAST_POLICY.maximumQueued) return false;
      store.set(keys, new Set([...active, id]));
      return true;
    },
    release(id: string): void {
      const active = store.get(keys);
      if (!active.has(id)) return;
      const next = new Set(active);
      next.delete(id);
      store.set(keys, next);
    },
  };
}
