import { useMemo, useSyncExternalStore } from 'react';
import {
  PAGE_COMPOSITION_DEFAULTS,
  PAGE_COMPOSITION_POLICY,
} from '../../core/page-composition-policy.js';

function getWideMedia(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return null;
  return window.matchMedia(`(min-width: ${PAGE_COMPOSITION_POLICY.wideAsideRem}rem)`);
}

export function useWidePage(): boolean {
  const media = useMemo(() => getWideMedia(), []);
  return useSyncExternalStore(
    (changed) => {
      media?.addEventListener('change', changed);
      return () => media?.removeEventListener('change', changed);
    },
    () => media?.matches ?? PAGE_COMPOSITION_DEFAULTS.wide,
    () => PAGE_COMPOSITION_DEFAULTS.wide,
  );
}
