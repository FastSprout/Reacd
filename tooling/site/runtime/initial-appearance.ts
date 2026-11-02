import { SITE_POLICY } from '../policy.js';
import { initialDesignStyles } from './initial-design.js';
import { readAppearance, readDesign } from './preferences.js';
import type { PreferenceHost } from './preferences.js';
import type { DesignPreferences } from '../design/preferences.js';

type AppearanceHost = PreferenceHost & Pick<Window, 'document'>;

export function updateInitialDesign(
  document: Document,
  appearance: 'light' | 'dark',
  design: DesignPreferences,
): void {
  const style = document.getElementById(SITE_POLICY.initialDesignId);
  if (style) style.textContent = initialDesignStyles(appearance, design);
}

export function applyInitialAppearance(host: AppearanceHost): void {
  updateInitialDesign(host.document, readAppearance(host), readDesign(host));
}
