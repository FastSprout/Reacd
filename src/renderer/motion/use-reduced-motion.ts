import { useSyncExternalStore } from 'react';
import { MARQUEE_POLICY } from '../../core/marquee-policy.js';
function subscribe(notify: () => void) {
  if (typeof globalThis.matchMedia !== 'function') return () => undefined;
  const query = globalThis.matchMedia(MARQUEE_POLICY.reducedMotionQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
function snapshot() {
  return typeof globalThis.matchMedia !== 'function'
    ? undefined
    : globalThis.matchMedia(MARQUEE_POLICY.reducedMotionQuery).matches;
}
function serverSnapshot() {
  return undefined;
}
export function useReducedMotion(): boolean | undefined {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
