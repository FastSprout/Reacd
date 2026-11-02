import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { FooterProps } from
  '@fastsprout/reacd/adapter-runtime/components/footer/footer.props.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiFooterProps = FooterProps;

export function MuiFooter(props: MuiFooterProps) {
  const theme = useTheme();
  return (
    <Stack component="footer" spacing={materialSpacing(theme)}>
      {props.top}
      <Stack
        direction="row"
        useFlexGap
        spacing={materialSpacing(theme)}
        sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {props.start}
        {props.children}
        {props.end}
      </Stack>
      {props.bottom}
    </Stack>
  );
}
