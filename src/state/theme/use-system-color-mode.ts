import { useCallback, useSyncExternalStore } from 'react';
import { COLOR_MODE_POLICY } from '../../core/color-mode-policy.js';
import type { ResolvedColorMode } from '../../core/color-mode-policy.js';

function subscribe(notify: () => void) {
  if (typeof matchMedia !== 'function') return () => undefined;
  const media = matchMedia(COLOR_MODE_POLICY.mediaQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}

export function useSystemColorMode(
  serverFallback: ResolvedColorMode,
): ResolvedColorMode {
  const read = useCallback(() => {
    if (typeof matchMedia !== 'function') return serverFallback;
    return matchMedia(COLOR_MODE_POLICY.mediaQuery).matches ? 'dark' : 'light';
  }, [serverFallback]);
  const server = useCallback(() => serverFallback, [serverFallback]);
  return useSyncExternalStore(subscribe, read, server);
}
