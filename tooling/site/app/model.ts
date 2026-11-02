import type { SiteNavigation, SitePage } from '../content/model.js';
import type { DesignPreferences } from '../design/preferences.js';

export interface SiteSearchEntry {
  readonly route: string;
  readonly title: string;
  readonly description: string;
}

export interface SitePayload {
  readonly page: SitePage;
  readonly navigation: readonly SiteNavigation[];
  readonly index: readonly SiteSearchEntry[];
  readonly origin: string;
  readonly title: string;
  readonly description: string;
}

export interface SiteActions {
  readonly copyText: (text: string) => Promise<void>;
  readonly readAppearance: () => 'light' | 'dark';
  readonly persistAppearance: (appearance: 'light' | 'dark') => void;
  readonly readDesign?: () => DesignPreferences;
  readonly persistDesign?: (preferences: DesignPreferences) => void;
  readonly appearanceReady?: () => void;
  readonly subscribeSearchShortcut?: (notify: () => void) => () => void;
}
