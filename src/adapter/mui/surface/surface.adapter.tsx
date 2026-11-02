import { useMemo } from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { AdapterSurfaceProps } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';
import { createMaterialTheme } from './theme.js';

export function MuiSurface({ template, templateId, children }: AdapterSurfaceProps) {
  const theme = useMemo(() => createMaterialTheme(template), [template]);
  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline
        enableColorScheme
        className="reacd-root"
        data-template={templateId}
        data-adapter="material-ui"
      >
        {children}
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}
