import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import type { AdapterSurfaceProps } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';
import { templateVariables } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/template-variables.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PrimitiveScope } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';
import { MuiToastProvider } from '../toast/toast-provider.js';
import { createMaterialTheme } from './theme.js';

export function MuiSurface({ template, templateId, children }: AdapterSurfaceProps) {
  const theme = useMemo(() => createMaterialTheme(template), [template]);
  const variables = templateVariables(template);
  return (
    <ThemeProvider theme={theme}>
      <PrimitiveScope primitives={muiPrimitives}>
        <ThemeVariablesContext value={variables}>
          <Box
            className="reacd-root"
            data-template={templateId}
            data-adapter="material-ui"
            style={variables}
          >
            <MuiToastProvider>{children}</MuiToastProvider>
          </Box>
        </ThemeVariablesContext>
      </PrimitiveScope>
    </ThemeProvider>
  );
}
