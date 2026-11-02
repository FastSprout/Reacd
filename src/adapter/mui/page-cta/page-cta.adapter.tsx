import Paper from '@mui/material/Paper';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { PageCTAProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-cta/page-cta.props.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { materialPageSurface } from '../layout/page-surface.js';
import { MuiPageHero } from '../page-hero/page-hero.adapter.js';

export type MuiPageCTAProps = PageCTAProps;

export function MuiPageCTA(props: MuiPageCTAProps) {
  const theme = useTheme();
  const surface = materialPageSurface(
    theme,
    props.variant ?? PAGE_PRESENTATION_DEFAULTS.variant,
    PAGE_PRESENTATION_DEFAULTS.intent,
    false,
    false,
  );
  return (
    <ThemeProvider theme={surface.theme}>
      <Paper variant={surface.variant} elevation={surface.elevation} sx={surface.sx}>
        <MuiPageHero {...props} />
      </Paper>
    </ThemeProvider>
  );
}
