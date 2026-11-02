import { templates } from '../../../src/schema/design/templates.data.js';
import { darkTemplateVariants } from
  '../../../src/schema/color-mode/default-templates.js';
import type { DesignTemplate } from '../../../src/schema/design/templates.schema.js';
import type { DesignPreferences } from './preferences.js';
import { NEUTRAL_COLORS, PRIMARY_COLORS } from './palettes.js';

const RADIUS = { none: 0, small: 0.25, medium: 0.5, large: 0.75 } as const;
const DENSITY = {
  comfortable: { spacing: templates['saas-modern-light'].spacing, fontSize: 1 },
  compact: { spacing: templates['erp-compact'].spacing, fontSize: 0.875 },
} as const;

export function resolveDesignTemplate(
  preferences: DesignPreferences,
  appearance: 'light' | 'dark',
): DesignTemplate {
  const base =
    appearance === 'dark'
      ? darkTemplateVariants['saas-modern-light']
      : templates['saas-modern-light'];
  const neutral = NEUTRAL_COLORS[preferences.neutral][appearance];
  const colors = { ...base.colors, ...neutral };
  const primary =
    preferences.primary === 'monochrome'
      ? { primary: colors.text, onPrimary: colors.canvas }
      : PRIMARY_COLORS[preferences.primary][appearance];
  const density = DENSITY[preferences.density];
  return {
    ...base,
    colors: { ...colors, ...primary, focus: primary.primary },
    font: preferences.font,
    radius: RADIUS[preferences.radius],
    spacing: { ...density.spacing },
    fontSize: density.fontSize,
  };
}
