import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { VStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/v-stack/v-stack.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiVStackProps = VStackProps;

export function MuiVStack(props: MuiVStackProps) {
  const theme = useTheme();
  return (
    <Stack spacing={materialSpacing(theme, props.spacing)} sx={{ minWidth: 0 }}>
      {props.children}
    </Stack>
  );
}
