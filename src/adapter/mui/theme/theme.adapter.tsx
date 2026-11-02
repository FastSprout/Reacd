import { useMemo } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { ThemeProps } from
  '@fastsprout/reacd/adapter-runtime/components/theme/theme.props.js';
import { DeclarationDefaults } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/declaration-defaults.js';
import { createMaterialTheme } from '../surface/theme.js';

export type MuiThemeProps = ThemeProps;

export function MuiTheme(props: MuiThemeProps) {
  const inherited = useTheme();
  const theme = useMemo(
    () =>
      props.template === undefined
        ? inherited
        : createMaterialTheme(props.template, inherited.direction),
    [props.template, inherited],
  );
  return (
    <ThemeProvider theme={theme}>
      <DeclarationDefaults defaults={props.defaults}>
        {props.children}
      </DeclarationDefaults>
    </ThemeProvider>
  );
}
