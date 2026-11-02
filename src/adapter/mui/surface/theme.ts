import { createTheme, getLuminance } from '@mui/material/styles';
import type { DesignTemplate } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { MUI_THEME_POLICY } from './theme-policy.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

declare module '@mui/material/styles' {
  interface Theme {
    reacd?: DesignTemplate;
  }
  interface ThemeOptions {
    reacd?: DesignTemplate;
  }
}

export function createMaterialTheme(
  template: DesignTemplate,
  direction: 'ltr' | 'rtl' = APPLICATION_DEFAULTS.direction,
) {
  const compact = template.fontSize < MUI_THEME_POLICY.compactFontSize;
  const size = compact ? 'small' : 'medium';
  return createTheme({
    reacd: template,
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
      secondary: { main: template.colors.muted, contrastText: template.colors.surface },
      error: { main: template.colors.danger, contrastText: template.colors.onDanger },
      background: { default: template.colors.canvas, paper: template.colors.surface },
      text: { primary: template.colors.text, secondary: template.colors.muted },
      divider: template.colors.border,
    },
    typography: {
      fontFamily: MUI_THEME_POLICY.fonts[template.font],
      fontSize: template.fontSize * MUI_THEME_POLICY.nativeFontSize,
    },
    shape: { borderRadius: template.radius * MUI_THEME_POLICY.rootFontPixels },
    spacing: `${template.spacing.small}rem`,
    components: {
      MuiButton: {
        defaultProps: { size },
        styleOverrides: {
          root: {
            minWidth: LAYOUT_POLICY.controlTargetPx,
            minHeight: LAYOUT_POLICY.controlTargetPx,
            maxWidth: '100%',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: LAYOUT_POLICY.controlTargetPx,
            minHeight: LAYOUT_POLICY.controlTargetPx,
          },
        },
      },
      MuiTypography: { styleOverrides: { root: { overflowWrap: 'anywhere' } } },
      MuiSelect: {
        styleOverrides: {
          select: {
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            height: 'auto',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: MUI_THEME_POLICY.elevation[template.shadow],
        },
      },
      MuiFormControl: {
        styleOverrides: { root: { overflowX: 'clip', overflowY: 'visible' } },
      },
      MuiTextField: {
        defaultProps: { size },
        styleOverrides: { root: { overflowX: 'clip', overflowY: 'visible' } },
      },
      MuiPaper: {
        defaultProps: {
          elevation: MUI_THEME_POLICY.elevation[template.shadow],
        },
      },
    },
  });
}
