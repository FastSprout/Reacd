import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { PageAsideProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-aside/page-aside.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiPageAsideProps = PageAsideProps;
export function MuiPageAside({ label, top, children, bottom }: MuiPageAsideProps) {
  const theme = useTheme();
  return (
    <Stack component="aside" aria-label={label} spacing={materialSpacing(theme)}
      sx={{ minWidth: 0, overflowWrap: 'anywhere',
        position: { md: 'sticky' }, top: 0, alignSelf: 'start',
        maxHeight: { md: '100dvh' }, overflowY: { md: 'auto' },
      }}>
      {top}
      {children}
      {bottom}
    </Stack>
  );
}
