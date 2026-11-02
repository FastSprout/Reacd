import { SITE_POLICY } from '../policy.js';
import { parseDesignPreferences } from '../design/preferences.js';

export type PreferenceHost = Pick<Window, 'localStorage' | 'matchMedia'>;

export function readAppearance(host: PreferenceHost): 'light' | 'dark' {
  try {
    const preference = host.localStorage.getItem(SITE_POLICY.appearancePreference);
    if (preference === 'light' || preference === 'dark') return preference;
  } catch {
    // Storage may be blocked even when the system preference is available.
  }
  return host.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function readDesign(host: Pick<PreferenceHost, 'localStorage'>) {
  try {
    const source = host.localStorage.getItem(SITE_POLICY.designPreference);
    const value: unknown = source === null ? undefined : JSON.parse(source);
    return parseDesignPreferences(value);
  } catch {
    return parseDesignPreferences(undefined);
  }
}
