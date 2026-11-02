import { useContext } from 'react';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { MainProps } from
  '@fastsprout/reacd/adapter-runtime/components/main/main.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiMainProps = MainProps;

export function MuiMain(props: MuiMainProps) {
  const theme = useTheme();
  const nested = useContext(MainScopeContext);
  return (
    <Stack
      component={nested ? 'section' : 'main'}
      spacing={materialSpacing(theme, 'large')}
      sx={{ minWidth: 0 }}
    >
      <MainScopeContext value={true}>{props.children}</MainScopeContext>
    </Stack>
  );
}
