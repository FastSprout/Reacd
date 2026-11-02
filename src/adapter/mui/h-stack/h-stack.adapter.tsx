import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { HStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/h-stack/h-stack.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiHStackProps = HStackProps;

export function MuiHStack(props: MuiHStackProps) {
  const theme = useTheme();
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      useFlexGap
      spacing={materialSpacing(theme, props.spacing)}
      sx={{ minWidth: 0, flexWrap: 'wrap' }}
    >
      {props.children}
    </Stack>
  );
}
