import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { PageBodyProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-body/page-body.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageBodyProps = PageBodyProps;
export function MuiPageBody({ children }: MuiPageBodyProps) {
  const theme = useTheme();
  return (
    <Stack component="article" spacing={materialSpacing(theme, 'large')}
      sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {children}
    </Stack>
  );
}
