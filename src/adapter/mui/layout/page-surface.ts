import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { PageCardProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-card/page-card.props.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

type Variant = NonNullable<PageCardProps['variant']>;
type Intent = NonNullable<PageCardProps['intent']>;

const MATERIAL_PAGE_SURFACES = {
  solid: { variant: 'elevation', elevation: 2 },
  outline: { variant: 'outlined', elevation: 0 },
  soft: { variant: 'elevation', elevation: 1 },
  subtle: { variant: 'outlined', elevation: 0 },
  ghost: { variant: 'elevation', elevation: 0 },
  naked: { variant: 'elevation', elevation: 0 },
} as const;

export function materialPageSurface(
  theme: Theme,
  variant: Variant,
  intent: Intent,
  highlight: boolean,
  spotlight: boolean,
) {
  const pair = {
    neutral: {
      main: theme.palette.text.primary,
      contrastText: theme.palette.background.paper,
    },
    primary: theme.palette.primary,
    danger: theme.palette.error,
  }[intent];
  const solid = variant === 'solid';
  const focusColor = theme.palette.primary.main;
  const focusOutline = `${LAYOUT_POLICY.focusOutlinePx}px solid ${focusColor}`;
  const palette = solid
    ? createTheme(theme, {
        palette: {
          text: { primary: pair.contrastText, secondary: pair.contrastText },
          background: { paper: pair.main },
        },
      })
    : theme;
  return {
    ...MATERIAL_PAGE_SURFACES[variant],
    theme: palette,
    sx: {
      minWidth: 0,
      color: solid ? pair.contrastText : theme.palette.text.primary,
      backgroundColor: solid ? pair.main : theme.palette.background.paper,
      borderColor: highlight ? pair.main : theme.palette.divider,
      borderWidth: highlight
        ? PAGE_PRESENTATION_POLICY.emphasisBorderMultiplier *
          LAYOUT_POLICY.borderWidthPx
        : undefined,
      borderStyle: highlight ? 'solid' : undefined,
      '&:hover, &:focus-within': spotlight
        ? {
            outline: focusOutline,
          }
        : undefined,
    },
  };
}
