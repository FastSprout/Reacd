import { useMemo } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { AppProps } from '@fastsprout/reacd/adapter-runtime/components/app/app.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';
import { SharedApp } from '../../shared/app/app.adapter.js';
import { PrimitiveScope } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export function MuiApp(properties: AppProps) {
  const inherited = useTheme();
  const direction = properties.direction ?? APPLICATION_DEFAULTS.direction;
  const theme = useMemo(() => ({ ...inherited, direction }), [inherited, direction]);
  return (
    <ThemeProvider theme={theme}>
      <PrimitiveScope primitives={muiPrimitives}>
        <SharedApp {...properties} />
      </PrimitiveScope>
    </ThemeProvider>
  );
}
