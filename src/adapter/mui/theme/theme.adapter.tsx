import { useMemo } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { ThemeProps } from
  '@fastsprout/reacd/adapter-runtime/components/theme/theme.js';
import { SharedTheme } from '../../shared/theme/theme.adapter.js';
import { PrimitiveScope } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';
import { createMaterialTheme } from '../surface/theme.js';

export function MuiTheme(properties: ThemeProps) {
  const inherited = useTheme();
  const theme = useMemo(
    () =>
      properties.template === undefined
        ? inherited
        : createMaterialTheme(properties.template, inherited.direction),
    [properties.template, inherited],
  );
  return (
    <ThemeProvider theme={theme}>
      <PrimitiveScope primitives={muiPrimitives}>
        <SharedTheme {...properties} />
      </PrimitiveScope>
    </ThemeProvider>
  );
}
