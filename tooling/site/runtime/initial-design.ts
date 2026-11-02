import { shadcnThemeVariables } from
  '../../../src/adapter/shadcn/surface/theme-variables.js';
import { resolveDesignTemplate } from '../design/preferences.js';
import type { DesignPreferences } from '../design/preferences.js';
import { SITE_POLICY } from '../policy.js';

export function initialDesignStyles(
  appearance: 'light' | 'dark',
  preferences: DesignPreferences,
): string {
  const template = resolveDesignTemplate(preferences, appearance);
  const tokens = Object.entries(shadcnThemeVariables(template))
    .map(([name, value]) => `${name}:${value}!important`)
    .join(';');
  return [
    `html{color-scheme:${appearance}}`,
    `body{background:${template.colors.canvas};color:${template.colors.text}}`,
    `html[data-reacd-boot] #${SITE_POLICY.rootId} ` +
      `[data-adapter="shadcn-ui"]{${tokens}}`,
  ].join('\n');
}
