import type { SiteActions } from '../app/model.js';
import { SITE_POLICY } from '../policy.js';
import { readAppearance, readDesign } from './preferences.js';
import { updateInitialDesign } from './initial-appearance.js';

export interface SiteHost extends Pick<
  Window,
  'document' | 'fetch' | 'navigator' | 'localStorage' | 'matchMedia'
> {
  readonly location: Pick<Location, 'href' | 'reload'>;
}

export function browserActions(
  host: Pick<SiteHost, 'document' | 'navigator' | 'localStorage' | 'matchMedia'>,
): SiteActions {
  let appearance: ReturnType<typeof readAppearance> | undefined;
  let design: ReturnType<typeof readDesign> | undefined;
  return {
    subscribeSearchShortcut: (notify) => {
      const listener = (event: KeyboardEvent) => {
        if (
          event.key.toLowerCase() === SITE_POLICY.searchShortcutKey &&
          (event.ctrlKey || event.metaKey) &&
          !event.altKey &&
          !event.isComposing
        ) {
          event.preventDefault();
          notify();
        }
      };
      host.document.addEventListener('keydown', listener);
      return () => host.document.removeEventListener('keydown', listener);
    },
    copyText: async (text) => host.navigator.clipboard.writeText(text),
    readAppearance: () => {
      appearance = readAppearance(host);
      return appearance;
    },
    persistAppearance: (next) => {
      appearance = next;
      try {
        host.localStorage.setItem(SITE_POLICY.appearancePreference, appearance);
      } catch {
        // The current application store remains authoritative without storage.
      }
      updateInitialDesign(host.document, appearance, design ?? readDesign(host));
    },
    readDesign: () => {
      design = readDesign(host);
      return design;
    },
    persistDesign: (next) => {
      design = next;
      try {
        host.localStorage.setItem(SITE_POLICY.designPreference, JSON.stringify(next));
      } catch {
        // Keep the current design usable when preference storage is blocked.
      }
      updateInitialDesign(host.document, appearance ?? readAppearance(host), design);
    },
    appearanceReady: () => {
      updateInitialDesign(
        host.document,
        appearance ?? readAppearance(host),
        design ?? readDesign(host),
      );
      host.document.documentElement.removeAttribute('data-reacd-boot');
    },
  };
}
