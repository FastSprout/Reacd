import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { AppProps } from
  '@fastsprout/reacd/adapter-runtime/components/app/app.props.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';

export type MuiAppProps = AppProps;

export function MuiApp(props: MuiAppProps) {
  const inherited = useTheme();
  const direction = props.direction ?? APPLICATION_DEFAULTS.direction;
  const cache = useMemo(
    () =>
      createCache({
        key: direction === 'rtl' ? 'muirtl' : 'mui',
        stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
      }),
    [direction],
  );
  const theme = useMemo(() => ({ ...inherited, direction }), [inherited, direction]);
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Box dir={direction} lang={props.language ?? APPLICATION_DEFAULTS.language}>
          {props.children}
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
