import { createTheme, getLuminance } from '@mui/material/styles';
import type { DesignTemplate } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { MUI_THEME_POLICY } from './theme-policy.js';
import { materialOverrides } from './theme-overrides.js';

import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';

export function createMaterialTheme(
  template: DesignTemplate,
  direction: 'ltr' | 'rtl' = APPLICATION_DEFAULTS.direction,
) {
  const compact = template.fontSize < MUI_THEME_POLICY.compactFontSize;
  return createTheme({
    direction,
    palette: {
      mode:
        getLuminance(template.colors.canvas) < MUI_THEME_POLICY.lightCanvasLuminance
          ? 'dark'
          : 'light',
      primary: {
        main: template.colors.primary,
        contrastText: template.colors.onPrimary,
      },
      secondary: {
        main: template.colors.muted,
        contrastText: template.colors.surface,
      },
      error: { main: template.colors.danger, contrastText: template.colors.onDanger },
      background: {
        default: template.colors.canvas,
        paper: template.colors.surface,
      },
      text: { primary: template.colors.text, secondary: template.colors.muted },
      divider: template.colors.border,
    },
    typography: {
      fontFamily: 'var(--reacd-font)',
      fontSize: template.fontSize * MUI_THEME_POLICY.rootFontPixels,
    },
    shape: { borderRadius: template.radius * MUI_THEME_POLICY.rootFontPixels },
    spacing: `${template.spacing.small}rem`,
    components: {
      ...materialOverrides,
      MuiButton: {
        ...materialOverrides.MuiButton,
        defaultProps: { size: compact ? 'small' : 'medium' },
      },
    },
  });
}
